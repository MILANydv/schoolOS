#!/bin/bash
cd /home/engine/project/School-management-backend && npm run dev > /tmp/backend.log 2>&1 &
sleep 3
cd /home/engine/project/School-management-frontend && pnpm run dev
