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
      happyArticles: [],
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
    this.state.loading = 'Refreshing...';
    this.setState({
      happyArticles: [],
    });
    this.setState({
      articles: [],
      articlesDataSource: this.state.articlesDataSource.cloneWithRows([]),
    });
      fetch(this.abcUrl)
      .then((response) => response.json())
      .then((responseData) => {
        this.state.loading = '';
          this.setState({
            articles: responseData.data.articles,
            articlesDataSource: this.state.articlesDataSource.cloneWithRows(responseData.data.articles),
          });
      })
      .done();
  }

  checkHappinessViaAlchemyAPI(article) {
    return fetch(this.alchemyUrl + '?apikey=' + this.apikey + '&text=' + article.title + " " + article.short_description  + '&outputMode=json',
      {
        method: 'post',
      })
    .then((response) => response.json())
    .then((responseData) => {
      if (responseData.docSentiment.type === 'positive') {
      // if (article.short_description[0] !== 'T') {
        this.state.happyArticles.push(article);
        this.setState({
          articlesDataSource: this.state.articlesDataSource.cloneWithRows(this.state.happyArticles),
        });
      }
    }).catch((err) => {
      console.warn(err);
    });
  }

  render() {
    return (
        <View style={styles.container}>
          <View style={styles.horizontal}>
            <Text style={styles.title}>Happy Mode {this.isHappyModeEnabled()}</Text>
            <Switch
            onValueChange={(value) => {this.setState({happyModeOn: value}); this.filterList(value);}}
            value={this.state.happyModeOn} />
          </View>
          <Text style = {styles.padded}>{this.state.loading}</Text>
          <ListView
            style={{backgroundColor: '#595959'}}
            dataSource={this.state.articlesDataSource}
            renderRow={this.renderArticle.bind(this)}
            enableEmptySections={true}
          />

        </View>

    );
  }

  renderArticle(article) {
    var col = (this.state.happyModeOn === true) ? '#bbff99' : '#bfbfbf';
    var imgUrl = (article.media && article.media['80x60'].length > 0) ? article.media['80x60'] : 'http://www.51allout.co.uk/wp-content/uploads/2012/02/Image-not-found.gif';
    return (
      <View style = {[styles.row, {backgroundColor: col}]}>
        <Image source={{uri: imgUrl}} style={styles.thumbnail}/>
        <View style={{flexDirection: 'column'}}>
          <Text style={styles.title}>{article.title}</Text>
          <Text style={styles.text}>{article.short_description}</Text>
        </View>

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
      this.state.loading = '';

    }
  }

  isHappyModeEnabled() {
    return (this.state.happyModeOn === true) ? 'ON!' : 'OFF';
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
    margin: 1,
    flexDirection: 'row',
    padding: 10,
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
    width: 220,
    marginLeft: 15,
  },
  title: {
    fontWeight: 'bold',
    width: 220,
    marginLeft: 15,
    marginBottom: 5,
  }
});

AppRegistry.registerComponent('ABCGoodNews', () => ABCGoodNews);
