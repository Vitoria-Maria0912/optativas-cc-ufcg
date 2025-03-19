@echo off
setlocal

REM Verifica se o usuário passou um argumento (o caminho do teste)
if "%~1"=="" (
    echo Uso: run-tests.bat caminho\para\teste.test.ts
    exit /b 1
)

REM Define a variável de ambiente DATABASE_URL
set "DATABASE_URL=postgresql://postgres:cc_ufcg123@localhost:5433/optatives_cc_ufcg_tests?schema=public"

REM Executa os testes no Jest via npm
cmd /c "npm run test %1"

endlocal
