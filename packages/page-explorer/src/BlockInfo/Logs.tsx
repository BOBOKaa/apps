// Copyright 2017-2021 @polkadot/app-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DigestItem } from '@polkadot/types/interfaces';
import type { Codec, TypeDef } from '@polkadot/types/types';

import React from 'react';

import { Expander, Table } from '@polkadot/react-components';
import Params from '@polkadot/react-params';
import { Raw, Struct, Tuple, Vec } from '@polkadot/types';
import { getTypeDef } from '@polkadot/types/create';

import { useTranslation } from '../translate';

interface Props {
  value?: DigestItem[];
}

function formatU8a (value: Raw): React.ReactNode {
  return (
    <Params
      isDisabled
      params={[{ type: getTypeDef('Bytes') }]}
      values={[{ isValid: true, value }]}
    />
  );
}

function formatStruct (struct: Struct): React.ReactNode {
  const params = Object.entries(struct.Type).map(([name, value]): { name: string; type: TypeDef } => ({
    name,
    type: getTypeDef(value)
  }));
  const values = struct.toArray().map((value): { isValid: boolean; value: Codec } => ({
    isValid: true,
    value
  }));

  return (
    <Params
      isDisabled
      params={params}
      values={values}
    />
  );
}

function formatTuple (tuple: Tuple): React.ReactNode {
  const params = tuple.Types.map((type): { type: TypeDef } => ({
    type: getTypeDef(type)
  }));
  const values = tuple.toArray().map((value): { isValid: boolean; value: Codec } => ({
    isValid: true,
    value
  }));

  return (
    <Params
      isDisabled
      params={params}
      values={values}
    />
  );
}

function formatVector (vector: Vec<Codec>): React.ReactNode {
  const type = getTypeDef(vector.Type);
  const values = vector.toArray().map((value): { isValid: boolean; value: Codec } => ({
    isValid: true,
    value
  }));
  const params = values.map((_, index): { name: string; type: TypeDef } => ({
    name: `${index}`,
    type
  }));

  return (
    <Params
      isDisabled
      params={params}
      values={values}
    />
  );
}

function formatItem (item: DigestItem): React.ReactNode {
  if (item.value instanceof Struct) {
    return formatStruct(item.value);
  } else if (item.value instanceof Tuple) {
    return formatTuple(item.value);
  } else if (item.value instanceof Vec) {
    return formatVector(item.value);
  } else if (item.value instanceof Raw) {
    return formatU8a(item.value);
  }

  return <div>{item.value.toString().split(',').join(', ')}</div>;
}

function Logs ({ value }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();

  return (
    <Table
      empty={t<string>('No logs available')}
      name={t<string>('logs')}
    >
      {value?.map((log, index) => (
        <tr key={`log:${index}`}>
          <td className='overflow'>
            <Expander summary={log.type.toString()}>
              {formatItem(log)}
            </Expander>
          </td>
        </tr>
      ))}
    </Table>
  );
}

export default React.memo(Logs);
