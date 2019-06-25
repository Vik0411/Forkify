
import axios from 'axios';


async function getResults(query){
    const proxy = 'https://cors-anywhere.herokuapp.com/';
    const key = '111116d6529bb8c4a8203a026f138881';
    try {
        const res = await axios(`${proxy}https://www.food2fork.com/api/search?key=${key}&q=${query}`);
        const recipes = res.data.recipes;
        console.log(recipes);
    } catch(error){
        alert(error);
    }
}

getResults('pizza');




