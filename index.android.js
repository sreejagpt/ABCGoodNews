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
    this.state.loading = 'Loading...';
    this.state.articles = [];
      fetch(this.abcUrl)
      .then((response) => response.json())
      .then((responseData) => {
        this.state.loading = '';
          this.setState({
            articles: responseData.data.articles,
          });
      })
      .done();
  }

  checkHappinessViaAlchemyAPI(article) {
    this.state.loading = 'Filtering Happy News...';
    return fetch(this.alchemyUrl + '?apikey=' + this.apikey + '&text=' + article.title + " " + article.short_description  + '&outputMode=json',
      {
        method: 'post',
      })
    .then((response) => response.json())
    .then((responseData) => {
      console.log(responseData);
      if (responseData.docSentiment.type !== 'positive') {
        this.state.articles.splice(this.state.articles.indexOf(article), 1);
      }
    }).catch((err) => {
      console.warn(err);
    });
    this.state.loading = '';
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
            dataSource={this.state.articlesDataSource.cloneWithRows(this.state.articles)}
            renderRow={this.renderArticle}
            enableEmptySections={true}
          />

        </View>

    );
  }

  renderArticle(article) {
    return (
      <View style = {styles.row}>
        <Image source={{uri: article.media['80x60']}} style={styles.thumbnail}/>
        <Text style={styles.text}>{article.short_description}</Text>
      </View> );
  }

  filterList(isHappyModeEnabled) {
    var _this = this;
    if (isHappyModeEnabled === false) {
      _this.fetchNews();
    } else {
      this.state.articles.forEach((article) => {
        _this.checkHappinessViaAlchemyAPI(article);
      });
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
    flexDirection: 'row',
  },
  padded: {
    marginLeft: 100,
  },
  settings: {
    width: 50,
    height: 50,
  },
  thumbnail: {
    width: 80,
    height: 60,
  },
  text: {
    width: 200,
    marginLeft: 15,
  }
});

AppRegistry.registerComponent('ABCGoodNews', () => ABCGoodNews);
