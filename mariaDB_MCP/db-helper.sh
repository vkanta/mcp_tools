#!/bin/bash

# Database Helper Script for CES Web Platform
# Usage: ./db-helper.sh [command] [args...]

DB_CONTAINER="podman-compose_mariadb_1"
DB_USER="root"
DB_PASS="rootpass"
DB_NAME="testdb"

case "$1" in
  "query")
    # Execute a SQL query
    # Usage: ./db-helper.sh query "SELECT * FROM campaigns"
    if [ -z "$2" ]; then
      echo "Usage: $0 query \"SQL_QUERY\""
      exit 1
    fi
    podman exec -it $DB_CONTAINER mariadb -u $DB_USER -p$DB_PASS $DB_NAME -e "$2"
    ;;
    
  "tables")
    # List all tables
    podman exec -it $DB_CONTAINER mariadb -u $DB_USER -p$DB_PASS $DB_NAME -e "SHOW TABLES;"
    ;;
    
  "describe")
    # Describe a table structure
    # Usage: ./db-helper.sh describe campaigns
    if [ -z "$2" ]; then
      echo "Usage: $0 describe TABLE_NAME"
      exit 1
    fi
    podman exec -it $DB_CONTAINER mariadb -u $DB_USER -p$DB_PASS $DB_NAME -e "DESCRIBE $2;"
    ;;
    
  "campaigns")
    # Show all campaigns
    podman exec -it $DB_CONTAINER mariadb -u $DB_USER -p$DB_PASS $DB_NAME -e "SELECT * FROM campaigns;"
    ;;
    
  "components")
    # Show all components
    podman exec -it $DB_CONTAINER mariadb -u $DB_USER -p$DB_PASS $DB_NAME -e "SELECT * FROM components;"
    ;;
    
  "relationships")
    # Show campaign-component relationships
    podman exec -it $DB_CONTAINER mariadb -u $DB_USER -p$DB_PASS $DB_NAME -e "
    SELECT 
      c.name as campaign_name,
      c.status,
      comp.name as component_name,
      comp.version,
      comp.type as component_type
    FROM campaigns c
    JOIN campaign_components cc ON c.id = cc.campaign_id
    JOIN components comp ON cc.component_id = comp.id
    ORDER BY c.id, comp.id;"
    ;;
    
  "interactive")
    # Start interactive MariaDB session
    podman exec -it $DB_CONTAINER mariadb -u $DB_USER -p$DB_PASS $DB_NAME
    ;;
    
  "backup")
    # Create a database backup
    # Usage: ./db-helper.sh backup [filename]
    BACKUP_FILE="${2:-backup_$(date +%Y%m%d_%H%M%S).sql}"
    podman exec $DB_CONTAINER mariadb-dump -u $DB_USER -p$DB_PASS $DB_NAME > "$BACKUP_FILE"
    echo "Database backed up to: $BACKUP_FILE"
    ;;
    
  "status")
    # Show database connection status
    echo "=== Database Status ==="
    echo "Container: $DB_CONTAINER"
    echo "Database: $DB_NAME"
    echo "User: $DB_USER"
    echo ""
    podman exec -it $DB_CONTAINER mariadb -u $DB_USER -p$DB_PASS -e "SELECT 'Database Connection: OK' as status;"
    ;;
    
  *)
    echo "CES Database Helper Script"
    echo ""
    echo "Usage: $0 [command] [args...]"
    echo ""
    echo "Commands:"
    echo "  query \"SQL\"     - Execute a SQL query"
    echo "  tables           - List all tables"
    echo "  describe TABLE   - Show table structure"
    echo "  campaigns        - Show all campaigns"
    echo "  components       - Show all components"
    echo "  relationships    - Show campaign-component relationships"
    echo "  interactive      - Start interactive MariaDB session"
    echo "  backup [file]    - Create database backup"
    echo "  status           - Show connection status"
    echo ""
    echo "Examples:"
    echo "  $0 query \"SELECT COUNT(*) FROM campaigns\""
    echo "  $0 describe campaigns"
    echo "  $0 campaigns"
    echo "  $0 backup my_backup.sql"
    ;;
esac