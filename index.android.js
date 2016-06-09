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
    this.abcUrl = 'http://mobile-api.abc.net.au/api/category/id/1';
    this.state = {
      articles : new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      }),
      happyModeOn: false,
    };
  }

  componentDidMount() {
      this.fetchData(this.abcUrl);
  }

  fetchData(url) {
      fetch(url)
      .then((response) => response.json())
      .then((responseData) => {
        console.log(responseData.data.articles);
          this.setState({
            articles: this.state.articles.cloneWithRows(responseData.data.articles),
          });
      })
      .done();
  }

  render() {
    return (

        <View style={styles.container}>
          <View style={styles.horizontal}>
            <Text>Happy Mode {this.isHappyModeEnabled()}</Text>
            <Switch
            onValueChange={(value) => this.setState({happyModeOn: value})}
            value={this.state.happyModeOn} />
          </View>


          <ListView
            dataSource={this.state.articles}
            renderRow={(article) => <Text style = {styles.row}>{article.short_description}</Text>}
          />

        </View>

    );
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
  settings: {
    width: 50,
    height: 50,
  },
});

AppRegistry.registerComponent('ABCGoodNews', () => ABCGoodNews);
