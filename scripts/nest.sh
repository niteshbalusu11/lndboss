#!/bin/bash

cd src/server/modules

while getopts "n:" arg; do
  case $arg in
    n) Arg=$OPTARG && nest g controller $Arg --no-spec && nest g service $Arg --no-spec && nest g module $Arg --no-spec;;
  esac
done
