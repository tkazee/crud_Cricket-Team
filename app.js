const express = require('express');

const app = express();

const {open}=require('sqlite')
const sqlite3 = require('sqlite3') 
const path =require('path')

const dbPath = path.join(__dirname, "cricketTeam.db");
let db = null;
const initializeDBAndServer = async ()=>{
    try{
        db=await open({
        filename : dbPath,
        driver: sqlite3.Database
    })
    app.listen(3000, ()=>{
    console.log('Server Running at 3000 port')
   
    })

    }catch(e){
        console.log(`DB Error : ${e.message}`);
         process.exit(1);
    }
    
}

initializeDBAndServer()
app.get('/players/',async(request,response)=>{
    // res.send('Hello World')
    const getPlayersQuery = `
    select * from cricket_team order by player_id;`;
    const result = await db.all(getPlayersQuery);
    response.send(result);

})
app.get('/players/:playerId/',async(request,response)=>{
    // res.send('Hello World')
    const {playerId} = request.params;

    const getPlayerQuery = `
    select * from cricket_team where player_id = ${playerId};`;
    const result = await db.get(getPlayerQuery);
    response.send(result);

})

app.post ('/books/',async(request,response)=>{
    const playerDetails = request.body;
    const {
        player_id,    
        player_name,  
        jersey_number, 
        role    
    } =playerDetails
    const addPlayerQuery=`
    insert into player ( 
        player_id,    
        player_name,  
        jersey_number, 
        role 
    )`
    values
    (
        `${player_id}`,
        `${player_name}`,
        `${jersey_number}`,
        `${role}`
    );
    const dbResponse = await db.run(addPlayerQuery);
  const player_id = dbResponse.lastID;
  response.send({ playerId: player_id });
})

