# Minerva Bot

Your personal assistant for everything McGill. Learn about courses, programs, buildings, cafeteria and library opening hours, uPrint locations and general FAQs.

## Idea

Currently it takes 10 clicks to get to a search box that lets you search McGill courses. Minerva Bot lives in your messenger, one click away, to search everything McGill!

## Features

### Course Look Up

#### Specific Queries
- Ask for courses by code "COMP 202", "Where is PHYS 232 in the Fall"
- Ask for courses by title "Courses about machine learning in the fall", "Courses about quantum mechanics"

You will get a response with times, professors, buildings and sections!

#### Freeform Queries
- Ask for courses by level: "500 level biology courses"
- Ask for programs: "Honours physics", "Culturual Studies Major"

### Building Look up
- Look for buildings on campus: "Where is the E-cafe?", "Show me frostbite"
- See where your classes are.
- Look for uPrint printers on campus.

## Tech

Minerva Bot is organized into *plugins*. When the server receives a message or postback, the query along with context and history is passed along to a chain of plugins (which are promises) that will process the data in the context. Each plugin will save *replies* into the context which will be sent back to the user. 

