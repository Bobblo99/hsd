# HSD GmbH - Felgenaufbereitungs-Verwaltungssystem

## 🎭 **Demo-Modus für Showcase**

Das System läuft standardmäßig im **Demo-Modus** mit Dummy-Daten für Präsentationen.

### **Demo aktivieren/deaktivieren:**
```typescript
// In lib/config.ts
export const USE_DUMMY_DATA = true;  // Demo-Modus AN
export const USE_DUMMY_DATA = false; // Echte Datenbank
```

### **Demo-Login:**
- **E-Mail:** `admin@hsd-gmbh.com`
- **Passwort:** `demo123`

### **Demo-Features:**
- ✅ **8 realistische Kunden** mit verschiedenen Status
- ✅ **Echte Bilder** von Pexels
- ✅ **Vollständige Admin-Funktionen** (CRUD)
- ✅ **Auto-Refresh** und Live-Updates
- ✅ **CSV-Export** funktioniert
- ✅ **QR-Code-Formular** funktioniert

---

## ⚡ Quick Start

**Lokale Appwrite:** Siehe `docs/LOCAL_APPWRITE_SETUP.md`
**Cloud Setup:** Siehe `docs/QUICK_START.md`
**Detaillierte Anleitung:** Siehe `docs/APPWRITE_SETUP.md`

## 🏠 Lokale Appwrite Installation

### Warum lokale Appwrite?
- ✅ **Nie offline** - Läuft auf deinem Server
- ✅ **Vollständige Kontrolle** - Deine Hardware, deine Daten
- ✅ **Kostenlos** - Keine Cloud-Kosten
- ✅ **DSGVO-sicher** - Daten bleiben in Deutschland
- ✅ **Gleiche Features** wie Appwrite Cloud

### Quick Setup:
```bash
# 1. Docker Compose herunterladen
curl -o docker-compose.yml https://appwrite.io/install/compose

# 2. Appwrite starten
docker-compose up -d

# 3. Console öffnen
open http://localhost

# 4. Setup durchführen (siehe docs/LOCAL_APPWRITE_SETUP.md)
```

## 🚀 Appwrite Setup

### 1. Appwrite Projekt erstellen
1. Gehe zu [Appwrite Cloud](https://cloud.appwrite.io)
2. Erstelle ein neues Projekt
3. Notiere dir die **Project ID**

### 2. Datenbank einrichten
1. **Database erstellen:**
   - Name: `hsd-felgen-db`
   - Notiere die **Database ID**

2. **Collections erstellen:**

   **Customers Collection:**
   - Collection ID: `customers`
   - Attributes:
     ```
     name (string, required, size: 255)
     email (string, required, size: 255)
     phone (string, required, size: 50)
     felgeBeschaedigt (enum: ja,nein, required)
     reparaturArt (enum: lackieren,polieren,schweissen,pulverbeschichten, required)
     schadensBeschreibung (string, required, size: 2000)
     bildIds (string[], required, array)
     status (enum: eingegangen,in-bearbeitung,fertiggestellt,abgeholt, required)
     createdAt (datetime, required)
     updatedAt (datetime, required)
     ```

   **Appointments Collection (optional):**
   - Collection ID: `appointments`
   - Attributes:
     ```
     customerName (string, required, size: 255)
     customerEmail (string, required, size: 255)
     customerPhone (string, size: 50)
     service (string, required, size: 255)
     appointmentDate (string, required, size: 20)
     appointmentTime (string, required, size: 10)
     status (enum: pending,confirmed,cancelled,completed, required)
     notes (string, size: 1000)
     createdAt (datetime, required)
     updatedAt (datetime, required)
     ```

### 3. Storage einrichten
1. **Bucket erstellen:**
   - Bucket ID: `felgen-images`
   - Name: `Felgen Images`
   - Permissions: Read access für alle, Write access für authenticated users

### 4. Authentication einrichten
1. **Admin User erstellen:**
   - Gehe zu Auth → Users
   - Erstelle einen neuen User für Admin-Zugang
   - E-Mail: `admin@hsd-gmbh.com` (oder deine gewünschte E-Mail)
   - Passwort: Sicheres Passwort wählen

### 5. Umgebungsvariablen konfigurieren
Bearbeite die `.env.local` Datei:

```env
# Appwrite Configuration
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=deine-project-id-hier
NEXT_PUBLIC_APPWRITE_DATABASE_ID=deine-database-id-hier
NEXT_PUBLIC_APPWRITE_CUSTOMERS_COLLECTION_ID=customers
NEXT_PUBLIC_APPWRITE_APPOINTMENTS_COLLECTION_ID=appointments
NEXT_PUBLIC_APPWRITE_AVAILABILITY_COLLECTION_ID=availability
NEXT_PUBLIC_APPWRITE_BUCKET_ID=felgen-images
```

## 🔐 Permissions Setup

### Database Permissions:
- **Read:** Any
- **Create:** Any (für Kundenformular)
- **Update:** Users (für Admin)
- **Delete:** Users (für Admin)

### Storage Permissions:
- **Read:** Any
- **Create:** Any (für Bild-Upload)
- **Update:** Users
- **Delete:** Users

## 📱 Verwendung

1. **Kundenseite:** `/kunde` - QR-Code optimierte Anmeldung
2. **QR-Code Generator:** `/qr-code` - Hilfe zum Erstellen des QR-Codes
3. **Admin-Login:** `/admin/login` - Mit Appwrite User anmelden
4. **Admin-Dashboard:** `/admin/dashboard` - Verwaltung aller Anfragen

## 🛠️ Features

- ✅ **Vollständige Appwrite Integration**
- ✅ **Echtzeit-Synchronisation** zwischen QR-Code-Seite und Admin
- ✅ **Sichere Authentifizierung** über Appwrite Auth
- ✅ **Datei-Upload** für Felgenbilder
- ✅ **Status-Management** (Eingegangen → In Bearbeitung → Fertiggestellt → Abgeholt)
- ✅ **CSV-Export** Funktion
- ✅ **Responsive Design** für alle Geräte
- ✅ **Production-Ready** Sicherheit

## 🔒 Sicherheit

- ✅ **Verschlüsselte Datenübertragung** (HTTPS)
- ✅ **Sichere Authentifizierung** über Appwrite
- ✅ **Datenschutz-konform** (DSGVO)
- ✅ **Sichere Datenspeicherung** in der Cloud
- ✅ **Backup-System** durch Appwrite

## 📱 QR-Code Integration

1. **QR-Code erstellen:** Gehe zu `/qr-code`
2. **URL für QR-Code:** `https://deine-domain.com/kunde`
3. **Ausdrucken** und in der Werkstatt aufhängen
4. **Kunden scannen** → Gelangen direkt zur Anmeldung
5. **Sofortige Synchronisation** mit Admin-Dashboard

## 🚀 Deployment

Das System ist bereit für:
- ✅ **Vercel** (empfohlen für Next.js)
- ✅ **Netlify**
- ✅ **Eigener Server**

Nach dem Deployment:
1. Domain in Appwrite Settings hinzufügen
2. QR-Code mit neuer Domain generieren
3. System ist produktionsbereit!

## 📞 Support

Bei Fragen zur Appwrite-Konfiguration:
- [Appwrite Dokumentation](https://appwrite.io/docs)
- [Appwrite Discord](https://discord.gg/appwrite)