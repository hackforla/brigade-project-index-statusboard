<template>
    <header>
        <nav>
            <div class="home">
                <router-link to="/">Brigade Project Index</router-link>
            </div>
            <ul>
                <li>
                    <router-link to="/projects">Find Projects</router-link>
                </li>
                <li>
                    <router-link to="/map">Map</router-link>
                </li>
                <li>
                    <router-link to="/leaders">Brigades</router-link>
                </li>
                <li>
                    <router-link to="/topics">Topics</router-link>
                </li>
                <li>
                    <router-link to="/topics/covid19">Covid-19 Related Projects</router-link>
                </li>
            </ul>
        </nav>
        <div id="filter-bar">
            <FilterControl></FilterControl>
        </div>
    </header>
</template>

<script>
import FilterControl from './FilterControl.vue';

export default {
    components: {
        FilterControl
    }
};
</script>

<style>
nav {
    top: 0;
    width: 100%;
    padding: 1rem 1rem 0 1rem;
    display: flex;
    justify-content: space-between;
    background-color: white;
}
nav .home {
    width: fit-content;
    vertical-align: baseline;
    font-size: 1.5rem;
}
nav ul {
    list-style: none;
    display: flex;
    align-items: flex-end;
    margin: unset;
}
nav ul li {
    padding-left: 1rem;
}
#filter-bar {
    padding: 10px;
    background-color: #399fd3;
    width: 100%;
    border-bottom: 0.5rem solid #ae0518;
}
</style>