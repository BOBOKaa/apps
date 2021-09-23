// Copyright 2017-2021 @polkadot/app-democracy authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveElectionsInfo } from '@polkadot/api-derive/types';
import type { AccountId } from '@polkadot/types/interfaces';

import React, { useRef } from 'react';

import { Table } from '@polkadot/react-components';

import { useTranslation } from '../translate';
import Candidate from './Candidate';

interface Props {
  allVotes?: Record<string, AccountId[]>;
  className?: string;
  electionsInfo?: DeriveElectionsInfo;
}

function Candidates ({ allVotes = {}, electionsInfo }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  const headerCandidatesRef = useRef([
    [t('account name'), 'start', 2],
    [],
    [t('votes')]
  ]);

  const headerRunnersRef = useRef([
    [t('account name'), 'start', 2],
    [t('backing'), 'expand'],
    [t('votes')]
  ]);

  return (
    <>
      <Table
        empty={electionsInfo && t<string>('No runners up found')}
        header={headerRunnersRef.current}
        name={t<string>('runners up')}
      >
        {electionsInfo?.runnersUp.map(([accountId, balance]): React.ReactNode => (
          <Candidate
            address={accountId}
            balance={balance}
            key={accountId.toString()}
            voters={allVotes[accountId.toString()]}
          />
        ))}
      </Table>
      <Table
        empty={electionsInfo && t<string>('No candidates found')}
        header={headerCandidatesRef.current}
        name={t<string>('candidates')}
      >
        {electionsInfo?.candidates.map((accountId): React.ReactNode => (
          <Candidate
            address={accountId}
            key={accountId.toString()}
            voters={allVotes[accountId.toString()]}
          />
        ))}
      </Table>
    </>
  );
}

export default React.memo(Candidates);
