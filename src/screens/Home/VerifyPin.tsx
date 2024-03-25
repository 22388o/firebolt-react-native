import * as React from 'react';
import {useState, useEffect} from 'react';
import {
  Box,
  Text,
  Heading,
  HStack,
  Center,
  Button,
  ButtonText,
  ButtonIcon,
  RepeatIcon,
  CloseIcon,
  useToast,
  ButtonSpinner,
} from '@gluestack-ui/themed';
import {SCREEN_NAMES} from '../../navigation/screenNames';
import {RootStackParamList} from '../../navigation/OnBoarding';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';

import ShowToast from '../../components/ShowToast';
import {useConnectionContext} from '../../providers/ConnectionProvider';

const HEADING_TEXT_1 = 'Enter';
const HEADING_TEXT_2 = 'Your PIN code';
const VERIFY_SEED_TEXT = 'Please enter your 5 digit wallet PIN code!';

const SUBMIT_BTN_TEXT = 'Access Wallet';

type Props = NativeStackScreenProps<RootStackParamList, 'VerifyPin'>;

function VerifyPin({navigation}: Props) {
  const [verifyWalletPin, setVerifyWalletPin] = useState<(number | null)[]>(
    Array(5).fill(null),
  );
  const [buttonLoading, setButtonLoading] = useState(false);

  const {validatePin} = useConnectionContext();

  const toast = useToast();
  const digits = React.useMemo(
    () => [1, 2, 3, 4, 5, 6, 7, 8, 9, '', 0, 'X'],
    [],
  );

  const onResetPress = () => {
    setVerifyWalletPin(Array(5).fill(null));
  };

  const onDigitPress = (digit: number | string) => {
    if (typeof digit === 'number') {
      const emptyIndex = verifyWalletPin.findIndex(item => item === null);
      if (emptyIndex !== -1) {
        const newWalletPin = [...verifyWalletPin];
        newWalletPin[emptyIndex] = digit;
        setVerifyWalletPin(newWalletPin);
      }
    } else if (digit === 'X') {
      const emptyIndex = verifyWalletPin.findIndex(item => item === null);
      if (emptyIndex !== 0) {
        const digitRemovalIndex = emptyIndex === -1 ? 4 : emptyIndex - 1;
        const newWalletPin = [...verifyWalletPin];
        newWalletPin[digitRemovalIndex] = null;
        setVerifyWalletPin(newWalletPin);
      }
    }
  };

  const verifySeedPin = () => {
    const pin = verifyWalletPin.join('').toString();
    const result = validatePin(pin);
    console.warn(result, 'result');
    if (!result) {
      toast.show({
        placement: 'top',
        render: ({id}) => (
          <ShowToast
            id={id}
            action="error"
            description="Pin didn't match, please try again!"
          />
        ),
      });
      onResetPress();
    } else {
      navigation.navigate(SCREEN_NAMES.Dashboard);
    }
    setButtonLoading(false);
  };

  useEffect(() => {
    if (buttonLoading) {
      setTimeout(verifySeedPin, 1000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buttonLoading]);

  const onSubmit = async () => {
    setButtonLoading(true);
  };
  return (
    <Box py={'10%'} px={'$8'} bg="$primary400" flex={1}>
      <Heading fontWeight="400" w={'$3/5'} size="lg" color="white">
        {HEADING_TEXT_1}
      </Heading>
      <Heading w={'$3/5'} size="2xl" color="white">
        {HEADING_TEXT_2}
      </Heading>
      <Text
        mt={'$4'}
        fontWeight={'$bold'}
        size="md"
        color="white"
        textAlign={'left'}>
        {VERIFY_SEED_TEXT}
      </Text>
      <Box alignItems="flex-end">
        <Button
          size="md"
          onPress={onResetPress}
          mt={'$4'}
          variant="outline"
          action="secondary"
          isDisabled={false}
          isFocusVisible={false}>
          <ButtonIcon color="white" as={RepeatIcon} />
        </Button>
      </Box>
      <HStack
        space="lg"
        mt={'$8'}
        justifyContent="space-between"
        alignItems="center"
        reversed={false}
        flexWrap="wrap">
        {verifyWalletPin.map((item, index) => (
          <Box
            key={index}
            borderRadius={'$md'}
            borderColor="$secondary500"
            w="$12"
            h="$12"
            bg="$secondary500"
            px="$1"
            alignItems="center"
            justifyContent="center">
            <Text fontWeight="$bold" size="xl">
              {item}
            </Text>
          </Box>
        ))}
      </HStack>
      <HStack
        space="lg"
        mt={'$10'}
        justifyContent="center"
        alignItems="center"
        reversed={false}
        flexWrap="wrap">
        {digits.map((item, index) => (
          <Box key={index} alignItems="center" width="30%">
            <Button
              borderRadius={'$full'}
              width="$20"
              maxWidth={'100%'}
              h="$20"
              px="$1"
              variant="solid"
              action="secondary"
              onPress={() => onDigitPress(item)}
              isDisabled={false}
              isFocusVisible={false}>
              {item === 'X' ? (
                <ButtonIcon
                  color="$black"
                  as={CloseIcon}
                  m="$2"
                  w="$8"
                  h="$8"
                />
              ) : (
                <ButtonText color="$black" size="3xl">
                  {item}
                </ButtonText>
              )}
            </Button>
          </Box>
        ))}
      </HStack>
      <Center>
        <Button
          size="lg"
          mt={'$20'}
          w={'$5/6'}
          variant="solid"
          action="secondary"
          onPress={onSubmit}
          isDisabled={false}
          isFocusVisible={false}>
          {buttonLoading ? (
            <>
              <ButtonSpinner color="black" mr="$3" />
              <ButtonText color="black" fontWeight="$bold">
                Please wait...
              </ButtonText>
            </>
          ) : (
            <ButtonText color="black" fontWeight="$bold">
              {SUBMIT_BTN_TEXT}
            </ButtonText>
          )}
        </Button>
      </Center>
    </Box>
  );
}

export default VerifyPin;
