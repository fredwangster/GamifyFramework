@echo off
nodemon ./main.js -port 4000 -timeout 120000 -threads 1 -debug_mode true -db demo
pause