import React, {Component} from 'react';
import {
  TouchableOpacity,
  Text,
} from 'react-native';
import PropTypes from 'prop-types';

import styleConstructor from './style';
import {shouldUpdate} from '../../../component-updater';

import {
  TODAY_DATE,
  DISABLED_DATE,
  SELECTABLE_DATE
} from '../../../testIDs';

class Day extends Component {
  static propTypes = {
    // TODO: disabled props should be removed
    state: PropTypes.oneOf(['selected', 'disabled', 'today', '']),

    // Specify theme properties to override specific styles for calendar parts. Default = {}
    theme: PropTypes.object,
    marking: PropTypes.any,
    onPress: PropTypes.func,
    date: PropTypes.object
  };

  constructor(props) {
    super(props);
    this.style = styleConstructor(props.theme);
    this.onDayPress = this.onDayPress.bind(this);
    this.onDayLongPress = this.onDayLongPress.bind(this);
  }

  onDayPress() {
    this.props.onPress(this.props.date);
  }
  onDayLongPress() {
    this.props.onLongPress(this.props.date);
  }

  shouldComponentUpdate(nextProps) {
    return shouldUpdate(this.props, nextProps, ['state', 'children', 'marking', 'onPress', 'onLongPress']);
  }

  render() {
    let containerStyle = [this.style.base];
    let textStyle = [this.style.text];
    let testID;

    let marking = this.props.marking || {};
    if (marking && marking.constructor === Array && marking.length) {
      marking = {
        marking: true
      };
    }
    const isDisabled = typeof marking.disabled !== 'undefined' ? marking.disabled : this.props.state === 'disabled';

    if (marking.selected) {
      testID = SELECTABLE_DATE;
      containerStyle.push(this.style.selected);
    } else if (isDisabled) {
      testID = DISABLED_DATE;
      textStyle.push(this.style.disabledText);
    } else if (this.props.state === 'today') {
      testID = TODAY_DATE;
      containerStyle.push(this.style.today);
      textStyle.push(this.style.todayText);
    } else {
      testID = SELECTABLE_DATE;
    }

    if (marking.customStyles && typeof marking.customStyles === 'object') {
      const styles = marking.customStyles;
      if (styles.container) {
        if (styles.container.borderRadius === undefined) {
          styles.container.borderRadius = 16;
        }
        containerStyle.push(styles.container);
      }
      if (styles.text) {
        textStyle.push(styles.text);
      }
    }

    return (
      <TouchableOpacity
        testID={testID}
        style={containerStyle}
        onPress={this.onDayPress}
        onLongPress={this.onDayLongPress}
        activeOpacity={marking.activeOpacity}
        disabled={marking.disableTouchEvent}
      >
        <Text allowFontScaling={false} style={textStyle}>{String(this.props.children)}</Text>
      </TouchableOpacity>
    );
  }
}

export default Day;
