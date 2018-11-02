import * as React from 'react';

import { Upload, Button, Icon } from 'antd';
import en_US from '../../locale/en_US';

interface UploadButtonLocale {
  upload: string;
}

// default props
interface DefaultUploadButton {
  locale: UploadButtonLocale;
  onUpload: (uploadObject: any) => void;
}

// non default props
interface UploadButtonProps extends Partial<DefaultUploadButton> {
}

/**
 * Button to upload / import geodata file.
 */
class UploadButton extends React.Component<UploadButtonProps, {}> {

  public static defaultProps: DefaultUploadButton = {
    locale: en_US.GsUploadButton,
    onUpload: () => {return; }
  };

  render() {
    const {
      onUpload,
      locale
    } = this.props;

    return (
      <Upload
        name="file"
        action="memory"
        customRequest={onUpload}
      >
        <Button>
          <Icon type="upload" /> {locale.upload}
        </Button>
      </Upload>
    );
  }
}

export default UploadButton;
