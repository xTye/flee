#!/bin/bash

if [ -z "$1" ]
then
  echo "DON'T FORGET THE COMMIT MESSAGE"
  exit
fi

if [ ! -z "$2" ]
then
  echo "YOU FORGOT THE QUOTATION MARKS"
  exit
fi

git add .
git commit -m "$1"
git push