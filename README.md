# Minerva Bot

<img width="435" alt="screen shot 2016-05-24 at 9 58 14 pm" src="https://cloud.githubusercontent.com/assets/6295292/15525801/ec37add4-21fa-11e6-9e85-cd8f2d4b16d4.png">

Your personal assistant for everything McGill. Learn about courses, programs, buildings, cafeteria and library opening hours, uPrint locations and general FAQs.

## Idea

Currently it takes 10 clicks to get to a search box that lets you search McGill courses. Minerva Bot lives in your messenger, one click away, to search everything McGill!

## Features

### Course Look Up

#### Specific Queries
- Ask for courses by code "COMP 202", "Where is PHYS 232 in the Fall"
- Ask for courses by title "Courses about machine learning in the fall", "Courses about quantum mechanics"
 

<img width="435" src="https://cloud.githubusercontent.com/assets/6295292/15525873/85069e08-21fb-11e6-8cb7-3c8605515ecc.jpg" />
![image](https://cloud.githubusercontent.com/assets/6295292/15525886/a9430c70-21fb-11e6-88e4-0f31e50c8560.png)



You will get a response with times, professors, buildings and sections!

#### Freeform Queries
- Ask for courses by level: "500 level biology courses"
- Ask for programs: "Honours physics", "Culturual Studies Major"

<img width="435" src="https://cloud.githubusercontent.com/assets/6295292/15525936/0a10626e-21fc-11e6-861b-bd14ad2baf93.jpg"/>
![image](https://cloud.githubusercontent.com/assets/6295292/15525971/549e4e54-21fc-11e6-82a9-8df1418821d1.png)



### Building Look up
- Look for buildings on campus: "Where is the E-cafe?", "Show me frostbite"
- See where your classes are.
- Look for uPrint printers on campus.
 
![image](https://cloud.githubusercontent.com/assets/6295292/15525851/5377b76e-21fb-11e6-90bf-cdbf0fb972a1.png)
![image](https://cloud.githubusercontent.com/assets/6295292/15525865/6d9b68a2-21fb-11e6-99e4-5c099175bef8.png)
<img width="435" src="https://cloud.githubusercontent.com/assets/6295292/15526051/f478ae7e-21fc-11e6-855f-508c8a436242.jpg"/>



## Tech

Minerva Bot is organized into *plugins*. When the server receives a message or postback, the query along with context and history is passed along to a chain of plugins (which are promises) that will process the data in the context. Each plugin will save *replies* into the context which will be sent back to the user. 

