# Hair Boutique Demo

## Instagram Image Import Pipeline

Mit der lokalen Pipeline kannst du Instagram-Post-Links importieren und automatisch in Hero + Galerie anzeigen.

### 1) Konfiguration

Datei: `instagram-images.json`

```json
{
	"slug": "aleya-aesthetics",
	"links": [
		"https://www.instagram.com/p/DRfIjUkDBFJ"
	],
	"force": false
}
```

### 2) Import ausfuehren

```bash
npm run import-images
```

Oder per CLI mit direkten Parametern:

```bash
npm run import-images -- --slug aleya-aesthetics --links "https://www.instagram.com/p/DRfIjUkDBFJ,https://www.instagram.com/p/ABC123XYZ" --force
```

### 3) Ergebnis

- Bilder werden unter `public/imported/<slug>/` gespeichert
- Dateinamen:
	- `hero.jpg`
	- `gallery-1.jpg`, `gallery-2.jpg`, ...
- Website-Einbindung wird automatisch aktualisiert in:
	- `src/config/importedImages.ts`

### 4) Verhalten

- Es werden nur erfolgreiche Bild-Downloads gespeichert
- Content-Type wird geprueft (nur `image/*`)
- Ohne `--force` werden bestehende Dateien nicht ueberschrieben
- Zum Schluss wird eine klare Zusammenfassung ausgegeben (Erfolg, Fehler, erzeugte Dateien)
