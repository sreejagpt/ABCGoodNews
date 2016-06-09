import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  ListView,
} from 'react-native';

import SideMenu from 'react-native-side-menu';

class ABCGoodNews extends Component {

  constructor(props) {
    super(props);
    this.abcUrl = 'http://mobile-api.abc.net.au/api/category/id/1';
    this.state = {
      articles : new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      }),
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
    var menu = <Menu navigator={navigator}/>;
    return (
      <View style={styles.container}>
        <ListView
          dataSource={this.state.articles}
          renderRow={(article) => <Text style = {styles.row}>{article.short_description}</Text>}
        />

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  row: {
    backgroundColor: '#F0F0F0F0',
    margin: 10,
  },
});

AppRegistry.registerComponent('ABCGoodNews', () => ABCGoodNews);
