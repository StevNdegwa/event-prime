# event-prime
Event Management System (backend)

## Uses
1.  NodeJS - Server
2.  PassportJS - For User authentication and authorization
3.  NodeMailer - For sending emails
2.  MSSQL Server - For storing site data 


## Architecture
> I make us of 3 layers:
1.  Middleware<br/>
  This layer is responsible for data validation
2.  Controllers<br/>
  This layer is  responsible for business logic
3.  Models<br/>
  This layer is responsible for accessing data storage services
  
  The helper folder contains utililty functions and modules e.g emailing functions
  
## Users
1.  Super Admin<br/> 
  Owns the site. Can perfom any actions.
2.  Admin<br/>
  Owns an admin account. Has rights only on their account. One of their main functions is to create events and tickets for the event.
3.  Client<br/>
  Owns a client account. Has rights only on their account. This user can only view events created by an admin, and purchase tickets for an event.
