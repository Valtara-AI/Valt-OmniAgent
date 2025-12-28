#!/bin/bash

###############################################################################
# Valt OmniAgent - Health Check & Monitoring Script
# 
# This script monitors application health and sends alerts
#
# Usage: ./health-check.sh
# Cron: */5 * * * * /root/scripts/health-check.sh
###############################################################################

APP_NAME="valt-omniagent"
APP_URL="https://omni.valtara.ai"
APP_LOCAL_URL="http://localhost:3000"
ALERT_EMAIL="${ALERT_EMAIL:-}"
WEBHOOK_URL="${WEBHOOK_URL:-}"
LOG_FILE="/var/log/valt-health-check.log"

# Status tracking file
STATUS_FILE="/tmp/valt-health-status"

# Initialize status file if it doesn't exist
if [ ! -f "$STATUS_FILE" ]; then
    echo "healthy" > "$STATUS_FILE"
fi

PREVIOUS_STATUS=$(cat "$STATUS_FILE")
CURRENT_STATUS="healthy"
ISSUES=()

log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

send_alert() {
    local message="$1"
    local severity="$2"  # info, warning, critical
    
    log "ALERT [$severity]: $message"
    
    # Send webhook notification
    if [ -n "$WEBHOOK_URL" ]; then
        curl -X POST "$WEBHOOK_URL" \
            -H "Content-Type: application/json" \
            -d "{\"text\":\"[$severity] $message\",\"service\":\"$APP_NAME\",\"timestamp\":\"$(date -u +%Y-%m-%dT%H:%M:%SZ)\"}" \
            >/dev/null 2>&1 || true
    fi
    
    # Send email alert
    if [ -n "$ALERT_EMAIL" ] && command -v mail >/dev/null 2>&1; then
        echo "$message" | mail -s "[$severity] $APP_NAME Alert" "$ALERT_EMAIL" || true
    fi
}

# Check PM2 process
check_pm2() {
    if ! pm2 list | grep -q "$APP_NAME"; then
        ISSUES+=("PM2 process not found")
        return 1
    fi
    
    if ! pm2 list | grep -q "$APP_NAME.*online"; then
        ISSUES+=("PM2 process is not online")
        return 1
    fi
    
    return 0
}

# Check application response
check_app_response() {
    if ! curl -f -s -o /dev/null -w "%{http_code}" "$APP_LOCAL_URL" | grep -q "200\|301\|302"; then
        ISSUES+=("Application not responding on localhost:3000")
        return 1
    fi
    return 0
}

# Check external URL
check_external_url() {
    local response_code=$(curl -s -o /dev/null -w "%{http_code}" "$APP_URL" 2>/dev/null || echo "000")
    
    if [ "$response_code" != "200" ] && [ "$response_code" != "301" ] && [ "$response_code" != "302" ]; then
        ISSUES+=("External URL not accessible (HTTP $response_code)")
        return 1
    fi
    return 0
}

# Check SSL certificate
check_ssl() {
    local domain=$(echo "$APP_URL" | sed -e 's|https://||' -e 's|/.*||')
    local expiry_date=$(echo | openssl s_client -servername "$domain" -connect "$domain:443" 2>/dev/null | openssl x509 -noout -enddate 2>/dev/null | cut -d= -f2)
    
    if [ -n "$expiry_date" ]; then
        local expiry_epoch=$(date -d "$expiry_date" +%s)
        local now_epoch=$(date +%s)
        local days_until_expiry=$(( ($expiry_epoch - $now_epoch) / 86400 ))
        
        if [ $days_until_expiry -lt 30 ]; then
            ISSUES+=("SSL certificate expires in $days_until_expiry days")
            if [ $days_until_expiry -lt 7 ]; then
                send_alert "SSL certificate expires in $days_until_expiry days!" "critical"
            else
                send_alert "SSL certificate expires in $days_until_expiry days" "warning"
            fi
        fi
    fi
}

# Check disk space
check_disk_space() {
    local usage=$(df / | tail -1 | awk '{print $5}' | sed 's/%//')
    
    if [ $usage -gt 90 ]; then
        ISSUES+=("Disk usage critical: ${usage}%")
        send_alert "Disk usage is at ${usage}%" "critical"
    elif [ $usage -gt 80 ]; then
        ISSUES+=("Disk usage high: ${usage}%")
        send_alert "Disk usage is at ${usage}%" "warning"
    fi
}

# Check memory usage
check_memory() {
    local mem_usage=$(free | grep Mem | awk '{printf "%.0f", $3/$2 * 100}')
    
    if [ $mem_usage -gt 90 ]; then
        ISSUES+=("Memory usage critical: ${mem_usage}%")
        send_alert "Memory usage is at ${mem_usage}%" "critical"
    elif [ $mem_usage -gt 80 ]; then
        log "Warning: Memory usage is at ${mem_usage}%"
    fi
}

# Check CPU usage
check_cpu() {
    local cpu_usage=$(top -bn1 | grep "Cpu(s)" | sed "s/.*, *\([0-9.]*\)%* id.*/\1/" | awk '{print 100 - $1}' | cut -d. -f1)
    
    if [ $cpu_usage -gt 90 ]; then
        ISSUES+=("CPU usage critical: ${cpu_usage}%")
        send_alert "CPU usage is at ${cpu_usage}%" "warning"
    fi
}

# Check log file size
check_logs() {
    local log_dir="/var/www/valt-omniagent/logs"
    
    if [ -d "$log_dir" ]; then
        local log_size=$(du -sm "$log_dir" | cut -f1)
        
        if [ $log_size -gt 1000 ]; then
            log "Warning: Log directory size is ${log_size}MB"
        fi
    fi
}

# Check for errors in logs
check_error_logs() {
    local error_log="/var/www/valt-omniagent/logs/error.log"
    
    if [ -f "$error_log" ]; then
        local recent_errors=$(tail -100 "$error_log" | grep -i "error\|exception\|fatal" | wc -l)
        
        if [ $recent_errors -gt 10 ]; then
            ISSUES+=("High error count in logs: $recent_errors errors in last 100 lines")
        fi
    fi
}

# Auto-restart if needed
auto_restart() {
    if [ ${#ISSUES[@]} -gt 0 ]; then
        log "Attempting auto-restart due to health issues..."
        
        pm2 restart "$APP_NAME"
        sleep 10
        
        # Re-check after restart
        if curl -f -s "$APP_LOCAL_URL" >/dev/null 2>&1; then
            log "Auto-restart successful"
            send_alert "Application auto-restarted successfully after health check failure" "info"
            return 0
        else
            log "Auto-restart failed"
            send_alert "Application auto-restart FAILED - manual intervention required!" "critical"
            return 1
        fi
    fi
}

# Main health check
log "Starting health check..."

check_pm2 || CURRENT_STATUS="unhealthy"
check_app_response || CURRENT_STATUS="unhealthy"
check_external_url || CURRENT_STATUS="unhealthy"
check_ssl
check_disk_space
check_memory
check_cpu
check_logs
check_error_logs

# Report results
if [ "$CURRENT_STATUS" == "healthy" ]; then
    log "✓ All health checks passed"
    
    # Send recovery notification if previously unhealthy
    if [ "$PREVIOUS_STATUS" == "unhealthy" ]; then
        send_alert "Application recovered and is now healthy" "info"
    fi
else
    log "✗ Health check FAILED:"
    for issue in "${ISSUES[@]}"; do
        log "  - $issue"
    done
    
    # Send alert if status changed
    if [ "$PREVIOUS_STATUS" == "healthy" ]; then
        send_alert "Application health check FAILED: ${ISSUES[*]}" "critical"
    fi
    
    # Attempt auto-restart
    auto_restart
fi

# Update status file
echo "$CURRENT_STATUS" > "$STATUS_FILE"

# Generate metrics for monitoring
cat > /tmp/valt-metrics.txt << EOF
timestamp=$(date +%s)
status=$CURRENT_STATUS
issues=${#ISSUES[@]}
disk_usage=$(df / | tail -1 | awk '{print $5}' | sed 's/%//')
memory_usage=$(free | grep Mem | awk '{printf "%.0f", $3/$2 * 100}')
cpu_usage=$(top -bn1 | grep "Cpu(s)" | sed "s/.*, *\([0-9.]*\)%* id.*/\1/" | awk '{print 100 - $1}')
EOF

log "Health check completed. Status: $CURRENT_STATUS"

exit 0
