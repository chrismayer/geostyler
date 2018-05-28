import * as React from 'react';

import { Select } from 'antd';
const Option = Select.Option;
import 'antd/dist/antd.css';

import {
  Style as GsStyle,
  StyleParser as GsStyleParser,
} from 'geostyler-style';

import UploadButton from '../../UploadButton/UploadButton';

// default props
interface DefaultStyleLoaderProps {
  onStyleRead: (style: GsStyle) => void;
}
// non default props
interface StyleLoaderProps extends Partial<DefaultStyleLoaderProps> {
  parsers: GsStyleParser[];
}

// state
interface StyleLoaderState {
  activeParser?: GsStyleParser;
}

class StyleLoader extends React.Component<StyleLoaderProps, StyleLoaderState> {

  constructor(props: any) {
    super(props);
    this.state = {};
  }

  public static defaultProps: DefaultStyleLoaderProps = {
    onStyleRead: (style: GsStyle) => {return; }
  };

  parseStyle = (uploadObject: any) => {
    const {
      activeParser
    } = this.state;
    if (!activeParser) {
      return;
    }
    const parser = new activeParser();
    const file = uploadObject.file as File;
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = () => {
      const fileContent = reader.result;
      parser.readStyle(fileContent)
      .then(this.props.onStyleRead);
    };
  }

  getParserOptions = () => {
    return this.props.parsers.map((parser: any) => {
      return <Option key={parser.name} value={parser.name}>{parser.name}</Option>;
    });
  }

  onSelect = (selection: string) => {
    const activeParser = this.props.parsers.find(parser => parser.name === selection);
    if (activeParser) {
      this.setState({activeParser});
    }
  }

  render() {
    const {
      activeParser
    } = this.state;

    return (
      <div>
        Style Type:
        <Select
          style={{ width: 300 }}
          onSelect={this.onSelect}
        >
          {this.getParserOptions()}
        </Select>
        {
          activeParser ?
          <UploadButton
            label="Upload Style"
            onUpload={this.parseStyle}
          /> : null
        }
      </div>
    );
  }
}

export default StyleLoader;
