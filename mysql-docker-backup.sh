CONTAINER="nchucse-curriculum_db_1"
REPO="${HOME}/Desktop/NCHUCse-curriculum"

cd ${REPO}

. .env

# Backup
docker exec ${CONTAINER} mysqldump -u root --password=${MYSQL_ROOT_PASSWORD} ${MYSQL_DATABASE} | gzip -c > "${REPO}/backup/backup-`date +%Y-%m-%d`.sql.gz" > /var/log/NCHUCse_curriculum.log 2>&1

# Restore
# cat backup.sql | docker exec -i ${CONTAINER} /usr/bin/mysql -u root --password=${MYSQL_ROOT_PASSWORD} ${MYSQL_DATABASE}