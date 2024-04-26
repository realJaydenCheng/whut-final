
# 执行conda激活命令
Invoke-Expression -Command "conda activate wf"

# 启动 Elasticsearch 服务，并将输出重定向到日志文件
Start-Process -FilePath "D:\programs\elasticsearch-8.12.2\bin\elasticsearch.bat" -NoNewWindow -RedirectStandardOutput "C:\Users\realj\Desktop\Projects\whut-final\backend\var\es.log" -RedirectStandardError "C:\Users\realj\Desktop\Projects\whut-final\backend\var\es-error.log" -PassThru

# 休眠一段时间以确保 Elasticsearch 有足够时间启动
# Start-Sleep -Seconds 10

# 切换到项目目录
Set-Location -Path "C:\Users\realj\Desktop\Projects\whut-final\backend"

# 启动 FastAPI 服务，并将输出重定向到日志文件
Start-Process -FilePath "python" -ArgumentList "-m", "uvicorn", "model-server:server", "--reload", "--port", "8002" -NoNewWindow -RedirectStandardOutput "C:\Users\realj\Desktop\Projects\whut-final\backend\var\model-server.log" -RedirectStandardError "C:\Users\realj\Desktop\Projects\whut-final\backend\var\model-server-error.log" -PassThru
