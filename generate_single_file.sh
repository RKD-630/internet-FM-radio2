#!/bin/bash
echo "<!DOCTYPE html>" > full_app.html
echo "<html><head>" >> full_app.html
# Extract everything inside <head> except <link rel="stylesheet">
grep -v 'link rel="stylesheet" href="style.css"' index.html | sed -n '/<head>/,/<\/head>/p' | sed '1d;$d' >> full_app.html

echo "<style>" >> full_app.html
cat style.css >> full_app.html
echo "</style>" >> full_app.html
echo "</head>" >> full_app.html

# Extract everything inside <body> except <script src="script.js">
grep -v 'script src="script.js"' index.html | sed -n '/<body/,/<\/body>/p' | sed '$d' >> full_app.html

echo "<script>" >> full_app.html
cat script.js >> full_app.html
echo "</script>" >> full_app.html
echo "</body></html>" >> full_app.html
