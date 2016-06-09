import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  ListView,
  Image,
  Switch,
} from 'react-native';

class ABCGoodNews extends Component {

  constructor(props) {
    super(props);
    this.abcUrl = 'http://mobile-api.abc.net.au/api/category/id/4';
    this.alchemyUrl = 'http://gateway-a.watsonplatform.net/calls/text/TextGetTextSentiment'
    this.apikey = '57ca1ed8555db66e07da90574632d0b8171f5147';
    this.state = {
      articlesDataSource : new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      }),
      happyModeOn: false,
      articles: [],
    };
  }

  componentWillMount() {
    this.state.loading = 'Loading...';
  }

  componentDidMount() {
      this.state.loading = '';
      this.fetchNews();
  }

  fetchNews() {
      fetch(this.abcUrl)
      .then((response) => response.json())
      .then((responseData) => {
          this.setState({
            articles: responseData.data.articles,
            articlesDataSource: this.state.articlesDataSource.cloneWithRows(responseData.data.articles),
          });
          // articles.forEach((article) => {
          //   checkHappinessViaAlchemyAPI(article.title + " " + article.short_description);
          // };
      })
      .done();
  }

  checkHappinessViaAlchemyAPI(text) {
    fetch(this.alchemyUrl + '?apikey=' + this.apikey + '&text=' + text + '&outputMode=json',
      {
        method: 'post',
      })
    .then((response) => response.json())
    .then((responseData) => {
      console.warn(responseData.docSentiment.type);
      return responseData.docSentiment.type;
    }).catch(function(err) {
      console.warn(err);
    });
  }

  render() {
    return (

        <View style={styles.container}>
          <View style={styles.horizontal}>
            <Text>Happy Mode {this.isHappyModeEnabled()}</Text>
            <Switch
            onValueChange={(value) => {this.setState({happyModeOn: value}); this.filterList(value);}}
            value={this.state.happyModeOn} />
          </View>
          <Text style = {styles.padded}>{this.state.loading}</Text>

          <ListView
            dataSource={this.state.articlesDataSource}
            renderRow={(article) => <Text style = {styles.row}>{article.short_description}</Text>}
          />

        </View>

    );
  }

  filterList(isHappyModeEnabled) {
    var _this = this;
    if (isHappyModeEnabled === false) {
      _this.fetchNews();
    } else {
      var happyArticlesOnly = _this.state.articles.filter((article) => {
        _this.checkHappinessViaAlchemyAPI(article.title + " " + article.short_description) === 'positive';
      });
      console.warn(happyArticlesOnly.length);
    }
  }

  isHappyModeEnabled() {
    return (this.state.happyModeOn === true) ? 'ON' : 'OFF';
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#F5FCFF',
  },
  horizontal: {
    flexDirection: 'row',
    paddingLeft: 10,
  },
  row: {
    backgroundColor: '#F0F0F0F0',
    margin: 10,
  },
  padded: {
    paddingLeft: 10,
  },
  settings: {
    width: 50,
    height: 50,
  },
});

AppRegistry.registerComponent('ABCGoodNews', () => ABCGoodNews);
