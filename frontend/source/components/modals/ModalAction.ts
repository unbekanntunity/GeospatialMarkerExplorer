export interface IModalState {
  confirmDeleteModal?: {
    onConfirm: () => Promise<unknown>;
  };
}

export enum ModalAction {
  ShowModal,
  HideModal
}

export type ModalKey = keyof IModalState;

export type ModalReducerAction<M extends ModalKey = ModalKey> =
  | {
      type: ModalAction.ShowModal;
      modal: M;
      payload: NonNullable<IModalState[M]>;
    }
  | {
      type: ModalAction.HideModal;
      modal: M;
    };

export const modalReducer = (
  state: IModalState,
  action: ModalReducerAction
): IModalState => {
  switch (action.type) {
    case ModalAction.ShowModal:
      return {
        ...state,
        [action.modal]: action.payload
      };

    case ModalAction.HideModal:
      return {
        ...state,
        [action.modal]: undefined
      };

    default:
      return state;
  }
};
