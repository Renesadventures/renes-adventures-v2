#!/usr/bin/env bash
# Is WhatsApp actually connected to Lia? Ask the three questions that matter.
#
#   bash scripts/whatsapp-check.sh
#
# Needs WHATSAPP_TOKEN and WHATSAPP_PHONE_NUMBER_ID in the environment, or
# passed in:
#
#   WHATSAPP_TOKEN=EAA... WHATSAPP_PHONE_NUMBER_ID=123... bash scripts/whatsapp-check.sh
#
# Nothing here sends a message to anybody. It reads.

set -u
# The bare domain 307-redirects to www, and Meta does not follow redirects
# on a webhook. Register the www URL or the handshake silently fails.
BASE="${WHATSAPP_SITE:-https://www.renesadventures.tours}"
GRAPH="https://graph.facebook.com/v21.0"
TOKEN="${WHATSAPP_TOKEN:-}"
PNID="${WHATSAPP_PHONE_NUMBER_ID:-}"
FAIL=0

say () { printf '\n%s\n' "------------------------------------------------------------"; echo "$1"; }
bad () { echo "   ✗ $1"; FAIL=1; }
ok  () { echo "   ✓ $1"; }

jget () { python3 -c 'import json,sys
try:
  d=json.load(sys.stdin)
except Exception:
  print(""); raise SystemExit
for k in sys.argv[1:]:
  if isinstance(d,dict): d=d.get(k)
  else: d=None
print(d if d is not None else "")' "$@"; }

# ----------------------------------------------------------------- 1. token
say "1. Does the token work, and is the number registered?"
if [ -z "$TOKEN" ] || [ -z "$PNID" ]; then
  bad "WHATSAPP_TOKEN or WHATSAPP_PHONE_NUMBER_ID is not set — nothing to check."
else
  RES=$(curl -s --max-time 30 \
    "$GRAPH/$PNID?fields=display_phone_number,verified_name,quality_rating,platform_type,code_verification_status" \
    -H "Authorization: Bearer $TOKEN")
  NUM=$(printf '%s' "$RES" | jget display_phone_number)
  NAME=$(printf '%s' "$RES" | jget verified_name)
  PLAT=$(printf '%s' "$RES" | jget platform_type)
  QUAL=$(printf '%s' "$RES" | jget quality_rating)
  ERR=$(printf '%s' "$RES" | jget error message)

  if [ -n "$ERR" ]; then
    bad "Meta said: $ERR"
  else
    [ -n "$NUM" ]  && ok "Number:        $NUM"       || bad "No number came back."
    [ -n "$NAME" ] && ok "Shows up as:   $NAME"      || bad "No display name — it may still be in review."
    [ -n "$PLAT" ] && ok "Running on:    $PLAT"      || true
    [ -n "$QUAL" ] && ok "Quality:       $QUAL"      || true
  fi
fi

# ------------------------------------------------------- 2. webhook handshake
say "2. Will Meta's webhook handshake succeed?"
if [ -z "${META_VERIFY_TOKEN:-}" ]; then
  echo "   · META_VERIFY_TOKEN not set here, so only the rejection path is checked."
else
  GOOD=$(curl -s --max-time 30 \
    "$BASE/api/meta/webhook?hub.mode=subscribe&hub.verify_token=$META_VERIFY_TOKEN&hub.challenge=liacheck")
  [ "$GOOD" = "liacheck" ] && ok "The handshake returns the challenge." \
    || bad "The handshake did not echo the challenge. Got: ${GOOD:-(nothing)}"
fi

WRONG=$(curl -s -o /dev/null -w '%{http_code}' --max-time 30 \
  "$BASE/api/meta/webhook?hub.mode=subscribe&hub.verify_token=definitely-wrong&hub.challenge=x")
[ "$WRONG" = "403" ] && ok "A wrong token is refused (403)." \
  || bad "A wrong token returned $WRONG. It must be 403."

# ------------------------------------------------- 3. unsigned posts refused
say "3. Can a stranger inject a fake enquiry?"
SPOOF=$(curl -s -o /dev/null -w '%{http_code}' --max-time 30 \
  -X POST "$BASE/api/meta/webhook" -H 'Content-Type: application/json' \
  -d '{"object":"whatsapp_business_account","entry":[]}')
[ "$SPOOF" = "403" ] && ok "An unsigned POST is refused (403)." \
  || bad "An unsigned POST returned $SPOOF. It must be 403."

# ------------------------------------------------------------------ verdict
say "Verdict"
if [ "$FAIL" = "0" ]; then
  echo "   Everything checked passed."
  echo "   Last step is a human one: message the number from a phone that is not"
  echo "   Rene's, then look for the lead in Lia Desk."
else
  echo "   Something above is not right. Fix it before telling anyone it works."
fi
exit "$FAIL"
