
# 执行conda激活命令
Invoke-Expression -Command "conda activate wf"

# 切换到项目目录
Set-Location -Path "C:\Users\realj\Desktop\Projects\whut-final\backend"

# 启动 FastAPI 服务，并将输出重定向到日志文件
Start-Process -FilePath "python" -ArgumentList "-m", "uvicorn", "model_server:server", "--reload", "--port", "8002" -NoNewWindow 
