
import Search from './models/Search';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listViews from './views/listViews';
import {elements, renderLoader, clearLoader} from './views/base';
import Recipe from "./models/recipe";
import List from "./models/List";
import {clearRecipe} from "./views/recipeView";


/**Global state of the app
 * -Search object
 * -Current recipe object
 * -Shopping list object
 * -Liked recipes
 * */
const state = {};

// Search controller

const controlSearch = async() =>{
    // 1) get query from view
    const query = searchView.getInput();//TODO

    if(query){
        // 2) new search object and add to state
        state.search = new Search(query);
        // 3) prepare UI for results
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchRes);

        try {

            //4) search for recipes
            await state.search.getResults();
            //5) render result on UI
            clearLoader();``
            searchView.renderResults(state.search.result);
        }catch (err){
            alert(('something wrong with the search...'));
        }
    }
};

elements.searchForm.addEventListener('submit', e =>{
    e.preventDefault();
    controlSearch();
});



elements.searchResPages.addEventListener('click', e => {
    const btn = e.target.closest('.btn-inline');
    if(btn){
        const goToPage = parseInt(btn.dataset.goto, 10);
        searchView.clearResults();
        searchView.renderResults(state.search.result, goToPage);
        console.log(goToPage);
    }

});

// Recipe controller

 const controlRecipe = async () => {
     const id = window.location.hash.replace('#', '');
     console.log(id);

     if (id) {
         //prepare UI for changes
         recipeView.clearRecipe();
         renderLoader(elements.recipe);

         //highlight selected search item
         if (state.search) searchView.highlightSelected(id);

         //Create new recipe
         state.recipe = new Recipe(id);

         try {

             //get recipe data and parse ingredients
             await state.recipe.getRecipe();
             state.recipe.parseIngredients();
             //calculate servings and time
             state.recipe.calcTime();
             state.recipe.calcServings();
             // render recipe
             clearLoader();
             recipeView.renderRecipe(state.recipe);
         } catch (err) {
             alert('Error processing recipe');
         }
     }
 };

 window.addEventListener('hashchange',controlRecipe);
 window.addEventListener('load', controlRecipe);

['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));


//List controller
const controlList = () =>{
    //create a new List if there is none yet

    if (!state.list) state.list = new List();

    //add each ingredient to the list and UI
    state.recipe.ingredients.forEach(el => {
        const item = state.list.addItem(el.count, el.unit, el.ingredient);
        listViews.renderItem(item);
    });

}


//Handling recipe button clicks

elements.recipe.addEventListener('click', e => {
    if (e.target.matches('.btn-decrease, .btn-decrease *')){
        //decrease button is clicked
        if (state.recipe.servings > 1){
        state.recipe.updateServings('dec');
        recipeView.updateServingsIngredients(state.recipe);
        }
    } else if (e.target.matches('.btn-increase, .btn-increase *')) {
        //increase button is clicked
        state.recipe.updateServings('inc');
        recipeView.updateServingsIngredients(state.recipe);
    } else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')){
        controlList();
    }
    console.log(state.recipe);
});

window.l = new List();

