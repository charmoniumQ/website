import React, { useState } from 'react';
import Layout from './Layout';
import { Button, Card, Container, Input, Modal, Spacer, Text } from '@nextui-org/react';
import successAnimation from './success.json';
import Lottie from 'lottie-react';
import axios from 'axios';

interface ErrorCode {
  code?: number | string,
  message: string
}

interface HelperReturnType {
  color: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error',
  text: string
}

const Payment = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [errorMessageVisible, setErrorMessageVisible] = useState(false);
  const [confirmationVisible, setConfirmationVisible] = useState(false);
  const [alreadyMemberVisible, setAlreadyMemberVisible] = useState(false);

  const [errorMessage, setErrorMessage] = useState<ErrorCode | null>(null);

  const [netId, setNetId] = useState('');
  const [netIdConfirm, setNetIdConfirm] = useState('');
  const [validated, setValidated] = useState(false);

  const closeHandler = () => {
    setModalVisible(false);
  };

  const errorMessageCloseHandler = () => {
    setErrorMessageVisible(false);
    setErrorMessage(null);
  };

  const purchaseHandler = () => {
    const url = `https://membership.acm.illinois.edu/api/v1/checkout/session?netid=${netId}`;
    axios.get(url).then(response => {
      window.location.replace(response.data);
    }).catch((error) => {
      if (error.response) {
        if (error.response.status === 422) {
          const errorObj = error.response.data;
          setErrorMessage({
            code: errorObj.details[0].issue,
            message: errorObj.details[0].description
          });
          setErrorMessageVisible(true);
        } else if (error.response.status === 400) {
          const errorObj = error.response.data.errors;
          setErrorMessage({
            code: 400,
            message: errorObj[0].msg + ' for ' + errorObj[0].param
          });
          setErrorMessageVisible(true);
        } else if (error.response.status === 409) {
          // already a member
          setErrorMessage({
            code: 409,
            message: "The specified user is already a paid member."
          });
          setAlreadyMemberVisible(true);
        }else {
          setErrorMessage({
            code: 500,
            message: 'Internal server error: ' + error.response.data
          });
          setErrorMessageVisible(true);
        }
      }
    });
  };

  const validateNetId = (value: string) => {
    return value.match(/^[A-Z0-9]+$/i);
  };

  const netidHelper = React.useMemo((): HelperReturnType => {
    if (!netId)
      return {
        text: '',
        color: 'default'
      };
    const isValid = validateNetId(netId);
    if (isValid && validateNetId(netIdConfirm) && netId === netIdConfirm) {
      setValidated(true);
    } else {
      setValidated(false);
    }
    return {
      text: isValid ? '' : 'Enter a valid NetID',
      color: isValid ? 'success' : 'error'
    };
  }, [netId, netIdConfirm]);

  const netidConfirmHelper = React.useMemo((): HelperReturnType => {
    if (!netIdConfirm)
      return {
        text: '',
        color: 'default'
      };
    const isValid = validateNetId(netIdConfirm);
    if (isValid && validateNetId(netId) && netId === netIdConfirm) {
      setValidated(true);
    } else {
      setValidated(false);
    }
    return {
      text: isValid ? (netId === netIdConfirm ? '' : 'Your NetIDs did not match') : 'Enter a valid NetID',
      color: (isValid && netId === netIdConfirm) ? 'success' : 'error'
    };
  }, [netIdConfirm, netId]);

  return (
    <Layout>
      <Container xs css={{ height: '90vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Card css={{ margin: '2em' }}>
          <Card.Header>
            <Text b>
              ACM Membership
            </Text>
          </Card.Header>
          <Card.Divider />
          <Card.Body>
            <Text>
              Becoming a Lifetime <Text b>Paid Member</Text> not only sustains the continued growth of our communities but also
              comes with perks such as swipe access, free printing, priority access to our computing resources, etc.
            </Text>
            <Spacer />
            <Input
              color={netidHelper.color}
              helperColor={netidHelper.color}
              helperText={netidHelper.text}
              value={netId}
              onChange={(e) => setNetId(e.target.value)}
              placeholder='NetID'
              labelRight='@illinois.edu'
              bordered />
            <Spacer />
            <Input
              color={netidConfirmHelper.color}
              helperColor={netidConfirmHelper.color}
              helperText={netidConfirmHelper.text}
              value={netIdConfirm}
              onChange={(e) => setNetIdConfirm(e.target.value)}
              placeholder='Confirm NetID'
              labelRight='@illinois.edu'
              bordered />
            <Spacer />
            <Button disabled={!validated} onPress={purchaseHandler}>Purchase for $20.00</Button>
          </Card.Body>
        </Card>
        <Modal aria-labelledby='error-title' open={errorMessageVisible} onClose={errorMessageCloseHandler} closeButton>
          <Modal.Header>
            <Text h4 id='error-title'>Payment Failed</Text>
          </Modal.Header>
          <Modal.Body>
            <Text b>Error Code: {errorMessage && errorMessage.code}</Text>
            <Text>{errorMessage && errorMessage.message}</Text>
          </Modal.Body>
          <Card.Divider/>
          <Modal.Footer>
            {errorMessage && errorMessage.code && (<Text>
              If you believe that your payment has gone through, contact the <a href='mailto:treasurer@acm.illinois.edu'>ACM
              Treasurer</a> with the error code. Otherwise, feel free to try again.
            </Text>)}
          </Modal.Footer>
        </Modal>
        <Modal aria-labelledby='success-title' open={confirmationVisible} onClose={() => setConfirmationVisible(false)}
               closeButton>
          <Modal.Header>
            <Text h4 id='success-title'>You're now a Paid Member of ACM @ UIUC!</Text>
          </Modal.Header>
          <Modal.Body css={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Lottie animationData={successAnimation} loop={false} style={{ width: '10em' }} />
          </Modal.Body>
        </Modal>
        <Modal aria-labelledby='success-title' open={alreadyMemberVisible} onClose={() => setAlreadyMemberVisible(false)}
               closeButton>
          <Modal.Header>
            <Text h4 id='success-title'>You're already a Paid Member of ACM @ UIUC!</Text>
          </Modal.Header>
          <Modal.Body css={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Lottie animationData={successAnimation} loop={false} style={{ width: '10em' }} />
          </Modal.Body>
        </Modal>
      </Container>
    </Layout>
  );
};

export default Payment;
