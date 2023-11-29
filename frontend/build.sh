#!/usr/bin/env bash
set -o errexit
# Instalar dependencias y
# Ejecutar servidor react
yarn install --frozen-lockfile
yarn add react-router-dom
yarn build