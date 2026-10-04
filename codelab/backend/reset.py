from app.database import engine, SessionLocal
from app.models import Base
from app.seed import seed

print("Creating tables with new schema...")
Base.metadata.create_all(bind=engine)

print("Seeding database...")
db = SessionLocal()
seed(db)
db.close()

print("Success! You can start the server now.")