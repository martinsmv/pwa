# Projektdokumentation: ReST-Backend mit Spring Boot & PostgreSQL

## Zielsetzung

In diesem Projekt wird ein **ReST-Backend** auf Basis von **Spring Boot** erstellt, das CRUD-Funktionen (Create, Read, Update, Delete) über eine PostgreSQL-Datenbank bereitstellt.

Die ReST-Schnittstelle wird so aufgebaut, dass sie später von einer grafischen Oberfläche genutzt werden kann.

Zusätzlich wird die OpenAPI-Dokumentation (Swagger) automatisch generiert.

---

## Entwicklungsumgebung

| Komponente | Version / Tool |
| --- | --- |
| **IDE** | IntelliJ IDEA (Ultimate empfohlen) |
| **Framework** | Spring Boot |
| **Build-Tool** | Maven oder Gradle |
| **Java-Version** | 17 oder höher |
| **Datenbank** | PostgreSQL (über Docker oder extern) |
| **Hilfstool** | JPA Buddy (für Entity- und DTO-Generierung) |

---

## Projekt anlegen

### 1. Neues Spring Boot Projekt erstellen

In IntelliJ:

1. **Datei → Neu → Projekt → Spring Initializr**
2. Einstellungen:
    - Build Tool: **Maven** oder **Gradle**
    - Packaging: **JAR**
    - Java Version: **17**
    - Spring Boot Version: **neueste stabile Version**
3. Abhängigkeiten hinzufügen:
    - **Spring Web** → ReST-Endpunkte
    - **Spring Data JPA** → Datenbankzugriff mit ORM
    - **PostgreSQL Driver** → Datenbanktreiber
    - *(optional)* **Validation**, **Lombok**, **Spring Boot DevTools**
4. Projekt erstellen → IntelliJ lädt automatisch alle Abhängigkeiten.

---

## Projektstruktur

Nach der Erstellung sollte die Struktur wie folgt aussehen:

```
project-root/
├── compose.yaml
├── backend/
│   ├── build.gradle / pom.xml
│   ├── settings.gradle
│   └── src/
│       └── main/
│           ├── java/
│           │   └── com/example/backend/
│           │       ├── BackendApplication.java
│           │       ├── controller/
│           │       ├── model/
│           │       └── repository/
│           └── resources/
│               ├── application.yml
│               └── static/

```

---

## Datenbankverbindung einrichten

### 1. Neue Verbindung in IntelliJ anlegen

1. **View → Tool Windows → Database**
2. Klick auf ➕ → **Data Source → PostgreSQL**
3. Host, Port, Benutzername und Passwort eingeben
4. Verbindung testen 

Verbindung steht → Unter der DB venlab und schema backup findet man tabelle sample

## Entity erstellen

Mittels JPA kann nun eine Entity von der sample Tabelle erstellt werden
Die Colums und Referecnes sollen ausgewählt sein bzw. ausgeführt werden.. 

Danach sollten 4 Tabellen vorhanden sein (Box, BoxPos, Sample und Log)
