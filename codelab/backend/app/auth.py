import os
import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from .database import get_db
from .models import User

# This must exactly match the AUTH_SECRET we will put in Next.js
SECRET_KEY = os.getenv("AUTH_SECRET", "super-secret-dev-key")
ALGORITHM = "HS256"

# Tells FastAPI to look for a "Bearer" token in the Authorization header
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")


def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    """
    Dependency that extracts the JWT, verifies it, and returns the User.
    Creates the User in the DB if they don't exist yet.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        # 1. Decode the token using our shared secret
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("email")
        if email is None:
            raise credentials_exception
    except jwt.PyJWTError:
        # If the token is expired, tampered with, or invalid, throw a 401
        raise credentials_exception

    # 2. Look up the user in our SQLite database
    user = db.query(User).filter(User.email == email).first()
    
    # 3. If they don't exist, this is their first time logging in!
    # We auto-create their profile using data from the token.
    if user is None:
        user = User(
            email=email,
            name=payload.get("name", "Unknown"),
            avatar_url=payload.get("picture", ""),
            provider="oauth"
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        
    # 4. Return the database User object
    return user


oauth2_scheme_optional = OAuth2PasswordBearer(tokenUrl="auth/login", auto_error=False)

def get_optional_current_user(token: str | None = Depends(oauth2_scheme_optional), db: Session = Depends(get_db)):
    """
    Like get_current_user, but returns None if the user isn't logged in,
    instead of throwing a 401 error. Perfect for public pages.
    """
    if not token:
        return None
        
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get("email")
        if not email:
            return None
        # Just return the user if they exist. We won't auto-create on public pages.
        return db.query(User).filter(User.email == email).first()
    except jwt.PyJWTError:
        # Invalid or expired token, treat as logged out
        return None
