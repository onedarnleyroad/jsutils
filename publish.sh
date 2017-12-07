#!/bin/bash
git commit -a -m "minor updates"
npm version patch
git push
npm publish
