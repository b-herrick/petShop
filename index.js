const pg=require('pg');
const client=new pg.Client('postgress://localhost/petShop_db');
const express=require('express')
const app=express();

app.get('/api/pets',async(req,res,next)=>{
    try {
        const SQL=`SELECT * FROM pets`;
        const response=await client.query(SQL);
        res.send(response.rows);
    } catch (error) {
        next(error);
    }
});

app.get('/api/pets/:id', async(req,res,next)=>{
    try {
        const SQL=`SELECT * FROM pets WHERE id=$1`;
        const response=await client.query(SQL, [req.params.id]);
        res.send(response.rows);
    } catch (error) {
        next(error);
    }
})

app.delete('/api/pets/:id',async(req,res,next)=>{
    try {
        const SQL=`DELETE FROM pets WHERE id=$1 RETURNING *`
        const response=await client.query(SQL,[req.params.id])
        res.sendStatus(204);
    } catch (error) {
        next(error);
    }
});

const setup=async()=>{
    await client.connect();
    console.log('Connected that shit');
    const SQL=`
        DROP TABLE IF EXISTS pets;
        CREATE TABLE pets(
            id SERIAL PRIMARY KEY,
            name VARCHAR(20),
            isFavorite BOOLEAN
        );
        INSERT INTO pets (name, isFavorite) VALUES ('Cleo', true);
        INSERT INTO pets (name, isFavorite) VALUES ('Turbo', true);
        INSERT INTO pets (name, isFavorite) VALUES ('Lilly', true);
        INSERT INTO pets (name, isFavorite) VALUES ('Molly', false);
    `;
    await client.query(SQL);
    console.log('Made that shit');
    const port=process.env.PORT || 3000;
    app.listen(port, ()=>{
        console.log(`listening on port ${port}`);
    });
};

setup();