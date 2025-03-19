@echo off
setlocal enabledelayedexpansion

:: Ler o arquivo .env.test e encontrar a linha DATABASE_URL
for /f "tokens=1,* delims==" %%A in ('findstr /R "^DATABASE_URL=" .env.test') do (
    set DATABASE_URL=%%B
    set DATABASE_URL=!DATABASE_URL:"=!
)

:: Exibir a variável para debug (opcional)
echo DATABASE_URL=!DATABASE_URL!

:: Gerar o Prisma Client
npx prisma generate

:: Aplicar migrações
npx prisma migrate dev

:: Evitar fechamento automático (opcional)
pause
