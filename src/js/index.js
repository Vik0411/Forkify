
import Search from './models/Search';
import * as searchView from './views/searchView';
import {elements, renderLoader, clearLoader} from './views/base';

/**Global state of the app
 * -Search object
 * -Current recipe object
 * -Shopping list object
 * -Liked recipes
 * */
const state = {};

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

        //4) search for recipes
        await state.search.getResults();
        //5) render result on UI
        clearLoader();
        searchView.renderResults(state.search.result);

    }
};

elements.searchForm.addEventListener('submit', e =>{
    e.preventDefault();
    controlSearch();
});



