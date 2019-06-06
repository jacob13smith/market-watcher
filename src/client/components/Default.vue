<template>
  <div class="center">
    <v-card width="800px" style="margin:auto">
      <v-card-title>
        Statistics
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          append-icon="search"
          label="Search"
          single-line
          hide-details
        ></v-text-field>
      </v-card-title>
      <v-data-table
        :headers="headers"
        :items="stocks"
        :search="search"
        :rows-per-page-items='[15,25,50,100]'
        :pagination.sync="pagination"
      >
        <template v-slot:items="props">
          <tr :class="{ideal: props.item.discount > 0.25}" @click="openYahoo(props.item.hyperlink)">
            <td>{{ props.item.symbol }}</td>
            <td class="text-xs-left">{{ props.item.name }}</td>
            <td class="text-xs-left">{{ props.item.quote }}</td>
            <td class="text-xs-left">{{ props.item.graham }}</td>
            <td class="text-xs-left">{{ props.item.discount }}</td>
            </tr>
        </template>
        <template v-slot:no-results>
          <v-alert :value="true" color="error" icon="warning">
            Your search for "{{ search }}" found no results.
          </v-alert>
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<script>
import axios from 'axios';
  export default {
    data () {
      return {
        search: '',
        pagination: {
          descending: true,
          sortBy: 'discount'
        },
        headers: [
          {
            text: 'Symbol',
            align: 'left',
            value: 'symbol'
          },
          { text: 'Company Name', value: 'name' },
          { text: 'Current Price', value: 'price' },
          { text: 'Graham Number', value: 'graham' },
          { text: 'Discount', value: 'discount', sortable:true }
        ],
        stocks: []
      }
    },
	created(){
    var vm = this;
		axios.get('http://localhost/tsx')
		.then(function (response) {
      for (var i = 0; i < response.length; i++){
        if (response[i].graham == "Unknown" || response[i].graham == "Negative" || response[i].quote == "Negative"){
          response[i].discount = "0";
        } else if (response[i].graham > 0 && response[i].quote > 0.25){
          response[i].discount = (1 - response[i].quote / response[i].graham).toFixed(2);
        }  else {
          response[i].discount = (1 - response[i].quote.replace(",", "") / response[i].graham).toFixed(2);
        }
        response[i].hyperlink = `https://ca.finance.yahoo.com/quote/${response[i].symbol}/key-statistics?p=${response[i].symbol}`
      }
      vm.stocks = response;
		})
	},
  methods: {
    openYahoo(link){
      window.open(link, "_blank")
    }
  }
  }
</script>

<style>
.ideal {
  background-color: #4BB543;
}

.v-select {
	min-width: 25px;
}

input[type="text"]{
	background: none;
	border-bottom: none;
}
</style>