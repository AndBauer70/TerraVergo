#!/bin/bash
# Bereich für Lehrkräfte neu verschlüsseln (Begleithefte, Wissensbasen, Lösungsblätter).
# Doppelklick im Finder oder im Terminal: ./verschluesseln.command
# Das Passwort wird abgefragt und nirgends gespeichert.
cd "$(dirname "$0")" || exit 1
node lehrkraefte/werkzeug/verschluesseln.mjs "$@"
echo
read -n 1 -s -r -p "Fertig. Taste drücken zum Schließen …"
echo
