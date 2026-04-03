#!/bin/sh
export PATH="/opt/homebrew/bin:/usr/local/bin:$PATH"
cd /Users/kintaro/projects/aidev/petpals/apps/expo
exec /opt/homebrew/bin/node /opt/homebrew/bin/npx expo start -c --ios
