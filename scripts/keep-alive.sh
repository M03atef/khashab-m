#!/bin/bash
# Keep Next.js dev server running forever
cd /home/z/my-project
while true; do
  if ! pgrep -f "next-server" > /dev/null 2>&1; then
    echo "[$(date)] Restarting next-server..." >> /home/z/my-project/dev-keep.log
    setsid /home/z/my-project/node_modules/.bin/next dev -p 3000 -H 0.0.0.0 > /home/z/my-project/dev.log 2>&1 < /dev/null &
    disown
    sleep 15
  fi
  sleep 3
done
