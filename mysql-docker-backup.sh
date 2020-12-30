UPPERCASE=${PWD##*/}
CONTAINER=${UPPERCASE,,}

. .env

# Backup
docker exec ${CONTAINER}_db_1 mysqldump -u root --password=${MYSQL_ROOT_PASSWORD} ${MYSQL_DATABASE} | gzip -c > "${HOME}/Desktop/NCHUCse-curriculum/backup/backup-`date +%Y-%m-%d`.sql.gz"

# Restore
# cat backup.sql | docker exec -i ${CONTAINER}_db_1 /usr/bin/mysql -u root --password=${MYSQL_ROOT_PASSWORD} ${MYSQL_DATABASE}