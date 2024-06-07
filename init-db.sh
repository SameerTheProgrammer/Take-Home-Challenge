#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
<<<<<<< HEAD
    CREATE DATABASE chatPDF_prod;
    \connect chatPDF_prod
=======
    CREATE DATABASE chat_with_pdf_prod;
    \connect chat_with_pdf_prod
>>>>>>> 3c764623bf1fd513972ea8d991bb4b65bc2bf404
    CREATE EXTENSION IF NOT EXISTS vector;
EOSQL
