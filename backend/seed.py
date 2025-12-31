import logging
from sqlalchemy import insert, text
from app import engine, init_db, education, projects, skills, certifications, social_links, users

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def seed_data():
    logger.info("Initializing database...")
    init_db()

    with engine.connect() as conn:
        logger.info("Clearing existing data...")
        conn.execute(text("DELETE FROM education"))
        conn.execute(text("DELETE FROM projects"))
        conn.execute(text("DELETE FROM skills"))
        conn.execute(text("DELETE FROM certifications"))
        conn.execute(text("DELETE FROM social_links"))
        conn.execute(text("DELETE FROM users"))
        conn.commit()
        
        logger.info("Seeding admin user...")
        conn.execute(users.insert().values(
            username="ganesh",
            password="Ganesh@2805"
        ))
        conn.commit()

        logger.info("Seeding education...")
        conn.execute(insert(education), [
            {
                "institution": "Vel Tech Rangarajan Dr.Sagunthala R&D Institute of Science and Technology",
                "degree": "Bachelor of Engineering",
                "start_year": 2019,
                "end_year": 2023,
                "focus": "Computer Science",
                "location": "Chennai, India",
                "order_index": 1
            }
        ])

        logger.info("Seeding skills...")
        conn.execute(insert(skills), [
            {
                "category": "Languages",
                "items": [
                    {"name": "Python", "icon": "SiPython"},
                    {"name": "SQL", "icon": "SiPostgresql"},
                    {"name": "JavaScript", "icon": "SiJavascript"},
                    {"name": "HTML/CSS", "icon": "SiHtml5"}
                ],
                "order_index": 1
            },
            {
                "category": "Data Analysis",
                "items": [
                    {"name": "Pandas", "icon": "SiPandas"},
                    {"name": "NumPy", "icon": "SiNumpy"},
                    {"name": "Scikit-learn", "icon": "SiScikitlearn"},
                    {"name": "Matplotlib", "icon": "SiPlotly"}
                ],
                "order_index": 2
            },
            {
                "category": "Tools & Platforms",
                "items": [
                    {"name": "Tableau", "icon": "SiTableau"},
                    {"name": "Power BI", "icon": "RiBarChartFill"},
                    {"name": "Excel", "icon": "RiFileExcel2Fill"},
                    {"name": "Git", "icon": "SiGit"},
                    {"name": "VS Code", "icon": "VscVscode"}
                ],
                "order_index": 3
            }
        ])

        logger.info("Seeding projects...")
        conn.execute(insert(projects), [
            {
                "title": "E-commerce Sales Dashboard",
                "summary": "Interactive dashboard visualizing sales trends, customer demographics, and product performance using Tableau.",
                "tags": ["Tableau", "Data Visualization", "SQL"],
                "live_url": "#",
                "code_url": "#",
                "order_index": 1
            },
            {
                "title": "Customer Churn Prediction",
                "summary": "Machine learning model to predict customer churn based on usage patterns and demographics.",
                "tags": ["Python", "Scikit-learn", "Pandas"],
                "live_url": "#",
                "code_url": "#",
                "order_index": 2
            },
            {
                "title": "Portfolio Website",
                "summary": "Personal portfolio website built with React and Flask to showcase data analysis projects.",
                "tags": ["React", "Flask", "Tailwind CSS"],
                "live_url": "#",
                "code_url": "#",
                "order_index": 3
            }
        ])

        logger.info("Seeding certifications...")
        conn.execute(insert(certifications), [
            {
                "name": "Google Data Analytics Professional Certificate",
                "provider": "Google",
                "year": 2023,
                "details": "Comprehensive curriculum covering data cleaning, analysis, and visualization.",
                "order_index": 1
            },
            {
                "name": "SQL for Data Science",
                "provider": "Coursera",
                "year": 2022,
                "details": "In-depth course on SQL queries, joins, and database management.",
                "order_index": 2
            }
        ])

        logger.info("Seeding social links...")
        conn.execute(insert(social_links), [
            {
                "label": "LinkedIn",
                "url": "https://linkedin.com/in/yourprofile",
                "icon": "linkedin",
                "order_index": 1
            },
            {
                "label": "GitHub",
                "url": "https://github.com/yourusername",
                "icon": "github",
                "order_index": 2
            },
            {
                "label": "Email",
                "url": "mailto:ganesh@example.com",
                "icon": "mail",
                "order_index": 3
            }
        ])
        
        conn.commit()
        logger.info("Seeding complete!")

if __name__ == "__main__":
    seed_data()
