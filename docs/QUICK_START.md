# ⚡ Quick Start - 5 Minuten Setup

## 🤔 **Welche Datenbank?**

### **Lokale Appwrite (Maximale Kontrolle):**
- ✅ **Nie offline** (läuft auf deinem Server)
- ✅ **Kostenlos** (keine Cloud-Kosten)
- ✅ **Vollständige Kontrolle** über deine Daten
- ❌ **Wartung selbst** (Updates, Backups)

### **Appwrite Cloud (Empfohlen):**
- ✅ **Nie offline** (99.9% Uptime)
- ✅ **Kostenlos** bis 75k Requests/Monat
- ✅ **Automatische Backups**
- ✅ **Wartungsfrei**

### **SQLite Lokal:**
- ✅ **Komplett offline**
- ✅ **Kostenlos**
- ❌ **Backups selbst machen**
- ❌ **Wartung selbst**

**→ Für maximale Kontrolle: Lokale Appwrite**
**→ Für einfachste Lösung: Appwrite Cloud**
**→ Für Test/Entwicklung: SQLite**

## 🎯 Setup-Optionen:

### Option 1: Lokale Appwrite (Docker)
```
1. Docker installieren
2. docs/LOCAL_APPWRITE_SETUP.md folgen
3. http://localhost → Setup
4. Fertig - läuft komplett lokal!
```

### Option 2: Appwrite Cloud (Schnellste Methode)

### 1. Appwrite Account (2 Min)
```
1. https://cloud.appwrite.io → Registrieren
2. "Create Project" → Project ID notieren
3. Fertig!
```

### 2. Database Setup (2 Min)
```
1. Databases → "Create Database" → ID notieren
2. "Create Collection" → ID: customers
3. Attributes kopieren aus APPWRITE_SETUP.md
4. Permissions: Read/Create = Any
```

### 3. Storage Setup (30 Sek)
```
1. Storage → "Create Bucket" → ID: felgen-images  
2. Permissions: Read/Create = Any
```

### 4. Admin User (30 Sek)
```
1. Auth → Users → "Create User"
2. Email: admin@hsd-gmbh.com
3. Password: dein-passwort
```

### 5. Environment Variables (30 Sek)
```env
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=deine-project-id
NEXT_PUBLIC_APPWRITE_DATABASE_ID=deine-database-id  
NEXT_PUBLIC_APPWRITE_CUSTOMERS_COLLECTION_ID=customers
NEXT_PUBLIC_APPWRITE_BUCKET_ID=felgen-images
```

## ✅ Test:
```
npm run dev
→ /kunde (Formular testen)
→ /admin/login (Admin testen)
→ Fertig! 🚀
```

## 🆘 Probleme?
- Project ID falsch → Appwrite Dashboard prüfen
- Collection nicht gefunden → Attributes vollständig?
- Login geht nicht → Admin User erstellt?