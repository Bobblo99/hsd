# 🐳 Lokale Appwrite Installation mit Docker

## 🎯 **Warum lokale Appwrite?**
- ✅ **Nie offline** - Läuft auf deinem Server
- ✅ **Vollständige Kontrolle** - Deine Hardware, deine Daten
- ✅ **Kostenlos** - Keine Cloud-Kosten
- ✅ **Gleiche Features** wie Appwrite Cloud
- ✅ **DSGVO-sicher** - Daten bleiben in Deutschland

## 📋 **Voraussetzungen**
- Docker & Docker Compose installiert
- Mindestens 4GB RAM
- 10GB freier Speicherplatz

## 🚀 **Installation**

### 1. Appwrite herunterladen
```bash
# Appwrite CLI installieren
npm install -g appwrite-cli

# Oder direkt mit Docker
mkdir appwrite-local
cd appwrite-local
```

### 2. Docker Compose Setup
```bash
# Appwrite Docker Compose herunterladen
curl -o docker-compose.yml https://appwrite.io/install/compose

# Oder manuell erstellen:
```

Erstelle `docker-compose.yml`:
```yaml
version: '3'

services:
  appwrite:
    image: appwrite/appwrite:1.4.13
    container_name: appwrite
    restart: unless-stopped
    networks:
      - appwrite
    volumes:
      - appwrite-uploads:/storage/uploads:rw
      - appwrite-cache:/storage/cache:rw
      - appwrite-config:/storage/config:rw
      - appwrite-certificates:/storage/certificates:rw
      - appwrite-functions:/storage/functions:rw
    depends_on:
      - mariadb
      - redis
    environment:
      - _APP_ENV=production
      - _APP_WORKER_PER_CORE=6
      - _APP_LOCALE=de
      - _APP_CONSOLE_WHITELIST_ROOT=enabled
      - _APP_CONSOLE_WHITELIST_EMAILS=
      - _APP_CONSOLE_WHITELIST_IPS=
      - _APP_SYSTEM_EMAIL_NAME=HSD GmbH
      - _APP_SYSTEM_EMAIL_ADDRESS=admin@hsd-gmbh.local
      - _APP_SYSTEM_SECURITY_EMAIL_ADDRESS=security@hsd-gmbh.local
      - _APP_SYSTEM_RESPONSE_FORMAT=
      - _APP_OPTIONS_ABUSE=enabled
      - _APP_OPTIONS_FORCE_HTTPS=disabled
      - _APP_OPENSSL_KEY_V1=your-secret-key
      - _APP_DOMAIN=localhost
      - _APP_DOMAIN_TARGET=localhost
      - _APP_REDIS_HOST=redis
      - _APP_REDIS_PORT=6379
      - _APP_REDIS_USER=
      - _APP_REDIS_PASS=
      - _APP_DB_HOST=mariadb
      - _APP_DB_PORT=3306
      - _APP_DB_SCHEMA=appwrite
      - _APP_DB_USER=user
      - _APP_DB_PASS=password
      - _APP_SMTP_HOST=
      - _APP_SMTP_PORT=
      - _APP_SMTP_SECURE=
      - _APP_SMTP_USERNAME=
      - _APP_SMTP_PASSWORD=
      - _APP_USAGE_STATS=disabled
      - _APP_INFLUXDB_HOST=
      - _APP_INFLUXDB_PORT=
      - _APP_STORAGE_LIMIT=30000000
      - _APP_STORAGE_PREVIEW_LIMIT=20000000
      - _APP_STORAGE_ANTIVIRUS=disabled
      - _APP_STORAGE_ANTIVIRUS_HOST=clamav
      - _APP_STORAGE_ANTIVIRUS_PORT=3310
      - _APP_STORAGE_DEVICE=local
      - _APP_STORAGE_S3_ACCESS_KEY=
      - _APP_STORAGE_S3_SECRET=
      - _APP_STORAGE_S3_REGION=us-east-1
      - _APP_STORAGE_S3_BUCKET=
      - _APP_STORAGE_DO_SPACES_ACCESS_KEY=
      - _APP_STORAGE_DO_SPACES_SECRET=
      - _APP_STORAGE_DO_SPACES_REGION=us-east-1
      - _APP_STORAGE_DO_SPACES_BUCKET=
      - _APP_STORAGE_BACKBLAZE_ACCESS_KEY=
      - _APP_STORAGE_BACKBLAZE_SECRET=
      - _APP_STORAGE_BACKBLAZE_REGION=us-west-004
      - _APP_STORAGE_BACKBLAZE_BUCKET=
      - _APP_STORAGE_LINODE_ACCESS_KEY=
      - _APP_STORAGE_LINODE_SECRET=
      - _APP_STORAGE_LINODE_REGION=eu-central-1
      - _APP_STORAGE_LINODE_BUCKET=
      - _APP_STORAGE_WASABI_ACCESS_KEY=
      - _APP_STORAGE_WASABI_SECRET=
      - _APP_STORAGE_WASABI_REGION=eu-central-1
      - _APP_STORAGE_WASABI_BUCKET=
      - _APP_FUNCTIONS_SIZE_LIMIT=30000000
      - _APP_FUNCTIONS_TIMEOUT=900
      - _APP_FUNCTIONS_BUILD_TIMEOUT=900
      - _APP_FUNCTIONS_CONTAINERS=10
      - _APP_FUNCTIONS_CPUS=0
      - _APP_FUNCTIONS_MEMORY=0
      - _APP_FUNCTIONS_MEMORY_SWAP=0
      - _APP_FUNCTIONS_RUNTIMES=node-16.0,php-8.0,python-3.9,ruby-3.0
      - _APP_EXECUTOR_SECRET=your-executor-secret
      - _APP_EXECUTOR_HOST=http://appwrite-executor/v1
      - _APP_LOGGING_PROVIDER=
      - _APP_LOGGING_CONFIG=
    ports:
      - "80:80"
      - "443:443"

  appwrite-realtime:
    image: appwrite/appwrite:1.4.13
    container_name: appwrite-realtime
    restart: unless-stopped
    networks:
      - appwrite
    depends_on:
      - mariadb
      - redis
    environment:
      - _APP_ENV=production
      - _APP_WORKER_PER_CORE=6
      - _APP_OPTIONS_ABUSE=enabled
      - _APP_OPENSSL_KEY_V1=your-secret-key
      - _APP_REDIS_HOST=redis
      - _APP_REDIS_PORT=6379
      - _APP_DB_HOST=mariadb
      - _APP_DB_PORT=3306
      - _APP_DB_SCHEMA=appwrite
      - _APP_DB_USER=user
      - _APP_DB_PASS=password
      - _APP_USAGE_STATS=disabled
    command: realtime

  appwrite-worker-audits:
    image: appwrite/appwrite:1.4.13
    container_name: appwrite-worker-audits
    restart: unless-stopped
    networks:
      - appwrite
    depends_on:
      - redis
      - mariadb
    environment:
      - _APP_ENV=production
      - _APP_OPENSSL_KEY_V1=your-secret-key
      - _APP_REDIS_HOST=redis
      - _APP_REDIS_PORT=6379
      - _APP_DB_HOST=mariadb
      - _APP_DB_PORT=3306
      - _APP_DB_SCHEMA=appwrite
      - _APP_DB_USER=user
      - _APP_DB_PASS=password
      - _APP_LOGGING_PROVIDER=
      - _APP_LOGGING_CONFIG=
    command: worker-audits

  appwrite-worker-webhooks:
    image: appwrite/appwrite:1.4.13
    container_name: appwrite-worker-webhooks
    restart: unless-stopped
    networks:
      - appwrite
    depends_on:
      - redis
      - mariadb
    environment:
      - _APP_ENV=production
      - _APP_OPENSSL_KEY_V1=your-secret-key
      - _APP_REDIS_HOST=redis
      - _APP_REDIS_PORT=6379
      - _APP_DB_HOST=mariadb
      - _APP_DB_PORT=3306
      - _APP_DB_SCHEMA=appwrite
      - _APP_DB_USER=user
      - _APP_DB_PASS=password
      - _APP_LOGGING_PROVIDER=
      - _APP_LOGGING_CONFIG=
    command: worker-webhooks

  appwrite-worker-deletes:
    image: appwrite/appwrite:1.4.13
    container_name: appwrite-worker-deletes
    restart: unless-stopped
    networks:
      - appwrite
    depends_on:
      - redis
      - mariadb
    environment:
      - _APP_ENV=production
      - _APP_OPENSSL_KEY_V1=your-secret-key
      - _APP_REDIS_HOST=redis
      - _APP_REDIS_PORT=6379
      - _APP_DB_HOST=mariadb
      - _APP_DB_PORT=3306
      - _APP_DB_SCHEMA=appwrite
      - _APP_DB_USER=user
      - _APP_DB_PASS=password
      - _APP_LOGGING_PROVIDER=
      - _APP_LOGGING_CONFIG=
    command: worker-deletes

  appwrite-worker-databases:
    image: appwrite/appwrite:1.4.13
    container_name: appwrite-worker-databases
    restart: unless-stopped
    networks:
      - appwrite
    depends_on:
      - redis
      - mariadb
    environment:
      - _APP_ENV=production
      - _APP_OPENSSL_KEY_V1=your-secret-key
      - _APP_REDIS_HOST=redis
      - _APP_REDIS_PORT=6379
      - _APP_DB_HOST=mariadb
      - _APP_DB_PORT=3306
      - _APP_DB_SCHEMA=appwrite
      - _APP_DB_USER=user
      - _APP_DB_PASS=password
      - _APP_LOGGING_PROVIDER=
      - _APP_LOGGING_CONFIG=
    command: worker-databases

  appwrite-worker-builds:
    image: appwrite/appwrite:1.4.13
    container_name: appwrite-worker-builds
    restart: unless-stopped
    networks:
      - appwrite
    depends_on:
      - redis
      - mariadb
    environment:
      - _APP_ENV=production
      - _APP_OPENSSL_KEY_V1=your-secret-key
      - _APP_REDIS_HOST=redis
      - _APP_REDIS_PORT=6379
      - _APP_DB_HOST=mariadb
      - _APP_DB_PORT=3306
      - _APP_DB_SCHEMA=appwrite
      - _APP_DB_USER=user
      - _APP_DB_PASS=password
      - _APP_LOGGING_PROVIDER=
      - _APP_LOGGING_CONFIG=
    command: worker-builds

  appwrite-worker-certificates:
    image: appwrite/appwrite:1.4.13
    container_name: appwrite-worker-certificates
    restart: unless-stopped
    networks:
      - appwrite
    depends_on:
      - redis
      - mariadb
    environment:
      - _APP_ENV=production
      - _APP_OPENSSL_KEY_V1=your-secret-key
      - _APP_REDIS_HOST=redis
      - _APP_REDIS_PORT=6379
      - _APP_DB_HOST=mariadb
      - _APP_DB_PORT=3306
      - _APP_DB_SCHEMA=appwrite
      - _APP_DB_USER=user
      - _APP_DB_PASS=password
      - _APP_LOGGING_PROVIDER=
      - _APP_LOGGING_CONFIG=
    command: worker-certificates

  appwrite-worker-functions:
    image: appwrite/appwrite:1.4.13
    container_name: appwrite-worker-functions
    restart: unless-stopped
    networks:
      - appwrite
    depends_on:
      - redis
      - mariadb
      - appwrite-executor
    environment:
      - _APP_ENV=production
      - _APP_OPENSSL_KEY_V1=your-secret-key
      - _APP_REDIS_HOST=redis
      - _APP_REDIS_PORT=6379
      - _APP_DB_HOST=mariadb
      - _APP_DB_PORT=3306
      - _APP_DB_SCHEMA=appwrite
      - _APP_DB_USER=user
      - _APP_DB_PASS=password
      - _APP_FUNCTIONS_TIMEOUT=900
      - _APP_EXECUTOR_SECRET=your-executor-secret
      - _APP_EXECUTOR_HOST=http://appwrite-executor/v1
      - _APP_LOGGING_PROVIDER=
      - _APP_LOGGING_CONFIG=
    command: worker-functions

  appwrite-executor:
    image: appwrite/appwrite:1.4.13
    container_name: appwrite-executor
    restart: unless-stopped
    networks:
      - appwrite
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
      - appwrite-functions:/storage/functions:rw
      - /tmp:/tmp:rw
    environment:
      - _APP_ENV=production
      - _APP_VERSION=1.4.13
      - _APP_FUNCTIONS_TIMEOUT=900
      - _APP_FUNCTIONS_BUILD_TIMEOUT=900
      - _APP_FUNCTIONS_CONTAINERS=10
      - _APP_FUNCTIONS_RUNTIMES=node-16.0,php-8.0,python-3.9,ruby-3.0
      - _APP_FUNCTIONS_CPUS=0
      - _APP_FUNCTIONS_MEMORY=0
      - _APP_FUNCTIONS_MEMORY_SWAP=0
      - _APP_FUNCTIONS_INACTIVE_THRESHOLD=60
      - _APP_EXECUTOR_SECRET=your-executor-secret
      - _APP_LOGGING_PROVIDER=
      - _APP_LOGGING_CONFIG=
      - _APP_STORAGE_DEVICE=local
    command: executor

  appwrite-worker-mails:
    image: appwrite/appwrite:1.4.13
    container_name: appwrite-worker-mails
    restart: unless-stopped
    networks:
      - appwrite
    depends_on:
      - redis
    environment:
      - _APP_ENV=production
      - _APP_OPENSSL_KEY_V1=your-secret-key
      - _APP_SYSTEM_EMAIL_NAME=HSD GmbH
      - _APP_SYSTEM_EMAIL_ADDRESS=admin@hsd-gmbh.local
      - _APP_REDIS_HOST=redis
      - _APP_REDIS_PORT=6379
      - _APP_SMTP_HOST=
      - _APP_SMTP_PORT=
      - _APP_SMTP_SECURE=
      - _APP_SMTP_USERNAME=
      - _APP_SMTP_PASSWORD=
      - _APP_LOGGING_PROVIDER=
      - _APP_LOGGING_CONFIG=
    command: worker-mails

  appwrite-worker-messaging:
    image: appwrite/appwrite:1.4.13
    container_name: appwrite-worker-messaging
    restart: unless-stopped
    networks:
      - appwrite
    depends_on:
      - redis
    environment:
      - _APP_ENV=production
      - _APP_OPENSSL_KEY_V1=your-secret-key
      - _APP_REDIS_HOST=redis
      - _APP_REDIS_PORT=6379
      - _APP_LOGGING_PROVIDER=
      - _APP_LOGGING_CONFIG=
    command: worker-messaging

  mariadb:
    image: mariadb:10.7
    container_name: appwrite-mariadb
    restart: unless-stopped
    networks:
      - appwrite
    volumes:
      - appwrite-mariadb:/var/lib/mysql:rw
    environment:
      - MYSQL_ROOT_PASSWORD=rootpassword
      - MYSQL_DATABASE=appwrite
      - MYSQL_USER=user
      - MYSQL_PASSWORD=password
    command: 'mysqld --innodb-flush-method=fsync'

  redis:
    image: redis:7.0-alpine
    container_name: appwrite-redis
    restart: unless-stopped
    networks:
      - appwrite
    volumes:
      - appwrite-redis:/data:rw

networks:
  appwrite:

volumes:
  appwrite-mariadb:
  appwrite-redis:
  appwrite-cache:
  appwrite-uploads:
  appwrite-certificates:
  appwrite-functions:
  appwrite-config:
```

### 3. Appwrite starten
```bash
# Alle Container starten
docker-compose up -d

# Status prüfen
docker-compose ps

# Logs anschauen
docker-compose logs -f appwrite
```

### 4. Appwrite Console öffnen
```
http://localhost
```

### 5. Setup durchführen
1. **Admin Account erstellen** - Beim ersten Besuch
2. **Projekt erstellen** - "HSD Felgen System"
3. **Database + Collections** erstellen (wie in APPWRITE_SETUP.md)
4. **Storage Bucket** erstellen
5. **Admin User** für Login erstellen

### 6. Environment Variables anpassen
```env
# Lokale Appwrite
NEXT_PUBLIC_APPWRITE_ENDPOINT=http://localhost/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=deine-project-id
NEXT_PUBLIC_APPWRITE_DATABASE_ID=deine-database-id
NEXT_PUBLIC_APPWRITE_CUSTOMERS_COLLECTION_ID=customers
NEXT_PUBLIC_APPWRITE_APPOINTMENTS_COLLECTION_ID=appointments
NEXT_PUBLIC_APPWRITE_AVAILABILITY_COLLECTION_ID=availability
NEXT_PUBLIC_APPWRITE_BUCKET_ID=felgen-images
```

## 🔧 **Management**

### Container verwalten:
```bash
# Stoppen
docker-compose stop

# Starten
docker-compose start

# Neustarten
docker-compose restart

# Logs anschauen
docker-compose logs -f

# Komplett entfernen (ACHTUNG: Daten weg!)
docker-compose down -v
```

### Backups erstellen:
```bash
# Database Backup
docker exec appwrite-mariadb mysqldump -u user -ppassword appwrite > backup.sql

# Volumes sichern
docker run --rm -v appwrite-uploads:/data -v $(pwd):/backup alpine tar czf /backup/uploads-backup.tar.gz -C /data .
```

## ✅ **Vorteile lokale Appwrite:**
- ✅ **Nie offline** - Läuft auf deinem Server
- ✅ **Vollständige Kontrolle** - Deine Hardware
- ✅ **Kostenlos** - Keine Cloud-Kosten
- ✅ **Gleiche Features** wie Cloud
- ✅ **DSGVO-sicher** - Daten bleiben lokal
- ✅ **Schnell** - Keine Internet-Latenz

## ⚠️ **Nachteile:**
- ❌ **Wartung selbst** - Updates, Backups
- ❌ **Hardware-Abhängig** - Server muss laufen
- ❌ **Kein Support** - Selbst troubleshooten
- ❌ **Skalierung begrenzt** - Ein Server

## 🚀 **Nach dem Setup:**
Das System funktioniert genauso wie mit Appwrite Cloud - nur dass alles lokal läuft!