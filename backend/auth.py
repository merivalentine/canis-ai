from fastapi import APIRouter, Request
from fastapi.responses import RedirectResponse
import os

router = APIRouter()

@router.get('/login')
async def login(request: Request):
    return RedirectResponse(url='/')
