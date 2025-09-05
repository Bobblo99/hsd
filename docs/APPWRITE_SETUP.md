# 🚀 Appwrite Setup - Schritt für Schritt

## 1. Appwrite Cloud Account erstellen

1. Gehe zu [https://cloud.appwrite.io](https://cloud.appwrite.io)
2. Registriere dich kostenlos
3. Erstelle ein neues Projekt
4. **Wichtig:** Notiere dir die **Project ID**

## 2. Database einrichten

### Database erstellen:
1. Gehe zu **Databases** im Appwrite Dashboard
2. Klicke **"Create Database"**
3. Name: `hsd-felgen-db`
4. **Wichtig:** Notiere dir die **Database ID**

### Collections erstellen:

#### Collection 1: Customers
1. Klicke **"Create Collection"**
2. Collection ID: `customers`
3. Name: `Customers`

**Attributes hinzufügen:**
```
name (String, required, size: 255)
email (String, required, size: 255)  
phone (String, required, size: 50)
felgeBeschaedigt (Enum, required, elements: ja,nein)
reparaturArt (Enum, required, elements: lackieren,polieren,schweissen,pulverbeschichten)
schadensBeschreibung (String, required, size: 2000)
bildIds (String, array, required)
status (Enum, required, elements: eingegangen,in-bearbeitung,fertiggestellt,abgeholt)
createdAt (DateTime, required)
updatedAt (DateTime, required)
```

**Permissions setzen:**
- Read: Any
- Create: Any  
- Update: Users
- Delete: Users

#### Collection 2: Appointments (Optional)
1. Collection ID: `appointments`
2. Name: `Appointments`

**Attributes:**
```
customerName (String, required, size: 255)
customerEmail (String, required, size: 255)
customerPhone (String, size: 50)
service (String, required, size: 255)
appointmentDate (String, required, size: 20)
appointmentTime (String, required, size: 10)
status (Enum, required, elements: pending,confirmed,cancelled,completed)
notes (String, size: 1000)
createdAt (DateTime, required)
updatedAt (DateTime, required)
```

## 3. Storage einrichten

1. Gehe zu **Storage** im Dashboard
2. Klicke **"Create Bucket"**
3. Bucket ID: `felgen-images`
4. Name: `Felgen Images`
5. **Permissions:**
   - Read: Any
   - Create: Any
   - Update: Users
   - Delete: Users

## 4. Authentication einrichten

1. Gehe zu **Auth** → **Users**
2. Klicke **"Create User"**
3. **Admin User erstellen:**
   - Email: `admin@hsd-gmbh.com` (oder deine E-Mail)
   - Password: Sicheres Passwort wählen
   - Name: `HSD Admin`

## 5. Environment Variables konfigurieren

Bearbeite die `.env.local` Datei mit deinen Appwrite-Daten:

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

## 6. Domain hinzufügen (für Production)

1. Gehe zu **Settings** → **Domains**
2. Füge deine Domain hinzu: `localhost:3000` (für lokal)
3. Für Production: `https://deine-domain.com`

## 7. Testen

1. Starte die Anwendung: `npm run dev`
2. Gehe zu `/kunde` und teste das Formular
3. Gehe zu `/admin/login` und melde dich an
4. Prüfe ob Daten im Admin-Dashboard erscheinen

## 🔧 Troubleshooting

### Häufige Fehler:

**"Project not found"**
- Prüfe die Project ID in `.env.local`

**"Collection not found"**  
- Prüfe die Collection IDs
- Stelle sicher, dass alle Collections erstellt sind

**"Permission denied"**
- Prüfe die Permissions der Collections
- Stelle sicher, dass "Any" für Read/Create gesetzt ist

**"Authentication failed"**
- Prüfe ob der Admin User erstellt wurde
- Prüfe Email/Password

## 📱 Nach dem Setup

Das System ist dann bereit für:
- ✅ QR-Code Kundenregistrierung
- ✅ Admin-Dashboard mit Echtzeit-Updates  
- ✅ Sichere Datenspeicherung
- ✅ Automatische Synchronisation
- ✅ Bild-Upload für Felgen

## 🚀 Production Deployment

Für Production:
1. Domain in Appwrite Settings hinzufügen
2. Environment Variables auf Server setzen
3. QR-Code mit Production-URL generieren
4. System ist live!